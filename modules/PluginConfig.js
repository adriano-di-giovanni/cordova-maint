var _ = require('lodash')

var isObject = _.isObject
var isFunction = _.isFunction
var isArray = _.isArray
var mergeWith = _.mergeWith
var find = _.find

function PluginConfig () {
  this.plugins = []
}

PluginConfig.prototype.add = function (id, spec, variables) {
  var _spec, _variables

  switch (arguments.length) {
    case 1:
      _spec = id
      break
    case 2:
      if (isObject(spec)) {
        _spec = id
        _variables = spec
      } else {
        _spec = spec
      }
      break
    case 3:
      _spec = spec
      _variables = variables
      break
    default:
  }

  this.plugins.push({
    id: id,
    spec: _spec,
    variables: _variables
  })

  return this
}

function getVariables (platform, projectName, variables) {
  var _variables = variables || {}
  var o = {}

  Object.keys(_variables).forEach(function (key) {
    var value = _variables[key]
    var t = isFunction(value) ? value(platform, projectName) : value
    if (t != null) {
      o[key] = t
    }
  })

  return o
}

function customizer (objValue, srcValue, key, object, source) {
  if (object.hasOwnProperty(key) && objValue !== srcValue) {
    var errorMessage = 'Can\'t merge :variable variable'
      .replace(':variable', key)
    throw new Error(errorMessage)
  }
}

function mergeVariables (platforms, projectName, variables) {
  var _variables = {}
  platforms.reduce(function (memo, platform) {
    return mergeWith(memo, getVariables(platform, projectName, variables), customizer)
  }, _variables)
  return _variables
}

PluginConfig.prototype.get = function (platforms, projectName, pluginId) {
  var _platforms = isArray(platforms) ? platforms : [platforms]

  var p = find(this.plugins, function (plugin) {
    return plugin.id === pluginId
  })

  if (!isObject(p)) {
    throw new Error('Plugin config not found for plugin with `id` ' + pluginId)
  }

  return {
    id: p.id,
    spec: p.spec,
    variables: mergeVariables(_platforms, projectName, p.variables)
  }
}

PluginConfig.prototype.getAll = function (platforms, projectName) {
  return this.plugins.map(function (plugin) {
    return this.get(platforms, projectName, plugin.id)
  }, this)
}

module.exports = PluginConfig
