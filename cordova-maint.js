#!/usr/bin/env node
var program = require('commander')

var Facade = require('./modules/Facade')

function _addPlatform (platform) {
  Facade.addPlatform(platform)
}

function _addProjectName (projectName) {
  Facade.addProjectName(projectName)
}

function _setConfigDir (configDir) {
  Facade.setConfigDir(configDir)
}

program
  .version(require('./package.json').version)

program
  .option('-p, --platform <platform>', 'Platform', _addPlatform)
  .option('-a, --project-name <project-name>', 'project name', _addProjectName)
  .option('-c, --config-dir <config-dir>', 'configuration directory', _setConfigDir)
  .command('plugin', 'manage project plugins')

program
  .parse(process.argv)
