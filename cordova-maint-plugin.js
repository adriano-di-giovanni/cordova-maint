#!/usr/bin/env node

var program = require('commander')

var Facade = require('./modules/Facade')

program
  .command('update <plugin-id...>')
  .description('update specified plugin')
  .action(function (pluginIds) {
    Facade.updatePlugins(pluginIds)
  })

program
  .parse(process.argv)
