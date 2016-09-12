# cordova-maint

[![Build Status](https://travis-ci.org/adriano-di-giovanni/cordova-maint.svg?branch=master)](https://travis-ci.org/adriano-di-giovanni/cordova-maint)

`cordova-maint` is a command-line utility for streamlining management of cordova-based projects.

It's in alpha.

## Installation

```
npm install -g cordova-maint
```

## Usage

`cordova-maint` is meant to be run within a cordova-based project's directory.

It needs to load configuration from `cordova-maint.js` in your project's directory.

You can also specify a different configuration directory using `-c, --config-dir` option.

### Configuration

```javascript
module.exports = function (config) {
  config
    .addPlugin('cordova-plugin-device')
    .addPlugin('cordova-plugin-x-socialsharing', 'https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git')
    .addPlugin('cc.fovea.cordova.purchase', {
      BILLING_KEY: function (platform) {
        if (platform === 'android') {
          return '' // the billing key for you app on Google Play Store
        }
      }
    })
}
```

### Running

You can only update your plugins for now.

You have to specify both platform and project name.

```shell
cd MyFirstApp/
cordova-maint --platform=android --project-name=MyFirstApp update cc.fovea.cordova.purchase
```
