function ShellTransform (config) {
  this._config = config
}

function getPlugin (id) {
  return this._config.getPlugin(id)
}

function transformVariables (variables) {
  return Object.keys(variables)
    .map(function (key) {
      return '--variable :key=":value"'
        .replace(':key', key)
        .replace(':value', variables[key])
    })
    .join(' ')
}

ShellTransform.prototype.removePlugin = function (id) {
  var plugin = getPlugin.call(this, id)
  return 'cordova plugin rm :id --save'
    .replace(':id', plugin.id)
    .trim()
}

ShellTransform.prototype.addPlugin = function (id) {
  var plugin = getPlugin.call(this, id)
  return 'cordova plugin add :spec :variables --save'
    .replace(':spec', plugin.spec)
    .replace(':variables', transformVariables(plugin.variables))
    .trim()
}

ShellTransform.prototype.updatePlugin = function (id) {
  return this.removePlugin(id) + '\n' + this.addPlugin(id)
}

module.exports = ShellTransform
