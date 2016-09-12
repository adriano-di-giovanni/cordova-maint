#!/usr/bin/env node
var program = require('commander')

var Facade = require('./modules/Facade')

function _addPlatform (platform) {
  Facade.addPlatform(platform)
}

function _setProjectName (projectName) {
  Facade.setProjectName(projectName)
}

function _setConfigDir (configDir) {
  Facade.setConfigDir(configDir)
}

function _setDryRun () {
  Facade.setDryRun(true)
}

program
  .version(require('./package.json').version)

program
  .option('-p, --platform <platform>', 'Platform', _addPlatform)
  .option('-a, --project-name <project-name>', 'project name', _setProjectName)
  .option('-c, --config-dir <config-dir>', 'configuration directory', _setConfigDir)
  .option('-d, --dry-run', 'dry run', _setDryRun)

program
  .command('update <plugin-id...>')
  .description('update specified plugin(s)')
  .action(function (pluginIds) {
    Facade.updatePlugins(pluginIds)
  })

program
  .command('update-all')
  .description('update all plugins')
  .action(function () {
    Facade.updateAllPlugins()
  })

program
  .parse(process.argv)
