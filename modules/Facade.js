// core deps
var path = require('path')
var exec = require('child_process').exec

// module deps
var Config = require('./Config')
var ShellTransform = require('./ShellTransform')

function Facade () {
  this._shouldLoadConfig = true
  this._configDir = process.cwd()
  var config = this._config = new Config()
  this._shellTransform = new ShellTransform(config)
  this._isDryRun = false
}

function _loadConfigIfNeeded () {
  if (!this._shouldLoadConfig) {
    return void 0
  }
  var configFile = path.join(this._configDir, './cordova-maint')
  require(configFile)(this._config)
}

Facade.prototype.addPlatform = function (platform) {
  this._config.addPlatform(platform)
  return this
}

Facade.prototype.setProjectName = function (projectName) {
  this._config.setProjectName(projectName)
  return this
}

Facade.prototype.setConfigDir = function (configDir) {
  this._configDir = configDir
  return this
}

Facade.prototype.setDryRun = function (isDryRun) {
  this._isDryRun = !!isDryRun
  return this
}

function _exec (command) {
  if (this._isDryRun) {
    console.log(command)
    return void 0
  }
  var child = exec(command)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}
function _createReducer (action) {
  var context = this
  return function (previousValue, currentValue) {
    return previousValue + '\n' + context._shellTransform[action](currentValue)
  }
}
Facade.prototype.updatePlugins = function (pluginIds) {
  _loadConfigIfNeeded.call(this)
  var reducer = _createReducer.call(this, 'updatePlugin')
  var command = pluginIds.reduce(reducer, '')
  return _exec.call(this, command)
}

Facade.prototype.updateAllPlugins = function () {
  _loadConfigIfNeeded.call(this)
  var shellTransform = this._shellTransform
  var command = ''

  function update (id) {
    command += shellTransform.updatePlugin(id) + '\n'
  }

  function remove (id) {
    command += shellTransform.removePlugin(id) + '\n'
  }

  function add (id) {
    command += shellTransform.addPlugin(id) + '\n'
  }

  this._config.implementPluginUpdateStrategy(update, remove, add)
  return _exec.call(this, command)
}

module.exports = new Facade()
