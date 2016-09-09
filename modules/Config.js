var PluginConfig = require('./PluginConfig')

function Config () {
  this._pluginConfig = new PluginConfig()
  this._platforms = []
}

Config.prototype.addPlatform = function (platform) {
  this._platforms.push(platform)
  return this
}

Config.prototype.getPlatforms = function () {
  return this._platforms.slice(0)
}

Config.prototype.setProjectName = function (projectName) {
  this._projectName = projectName
  return this
}

Config.prototype.getProjectName = function () {
  return this._projectName
}

Config.prototype.addPlugin = function () {
  var pluginConfig = this._pluginConfig
  PluginConfig.prototype.add.apply(pluginConfig, arguments)
  return this
}

Config.prototype.getPlugin = function (id) {
  return this._pluginConfig.get(this.getPlatforms(), this.getProjectName(), id)
}

module.exports = Config
