var ShellTransform = require('../../modules/ShellTransform')
var Config = require('../../modules/Config')

describe('ShellTransform', function () {
  var config

  before(function () {
    config = (new Config())
      .addPlatform('android')
      .addPlatform('ios')
      .addPlugin('cordova-plugin-camera', 'cordova-plugin-camera')
      .addPlugin('cc.fovea.cordova.purchase', 'cc.fovea.cordova.purchase', {
        'BILLING_KEY': function (platform) {
          if (platform === 'android') {
            return 'android/BILLING_KEY'
          }
        }
      })
  })

  describe('constructor', function () {
    it('should instantiate `ShellTransform`', function () {
      var config = new Config()
      var shellTransform = new ShellTransform(config)
      expect(shellTransform).to.be.instanceOf(ShellTransform)
      expect(shellTransform._config).to.equal(config)
    })
  })

  describe('removePlugin', function () {
    var shellTransform

    before(function () {
      shellTransform = new ShellTransform(config)
    })

    it('should throw an error if plugin doesn\'t exist', function () {
      expect(function () {
        shellTransform.removePlugin('non-existent-plugin-id')
      }).to.throw(Error, /not found/)
    })

    it('should work', function () {
      expect(
        shellTransform.removePlugin('cordova-plugin-camera')
      ).to.equal(
        'cordova plugin rm cordova-plugin-camera'
      )
      expect(
        shellTransform.removePlugin('cc.fovea.cordova.purchase')
      ).to.equal(
        'cordova plugin rm cc.fovea.cordova.purchase'
      )
    })
  })

  describe('addPlugin', function () {
    var shellTransform

    before(function () {
      shellTransform = new ShellTransform(config)
    })

    it('should throw an error if plugin doesn\'t exist', function () {
      expect(function () {
        shellTransform.addPlugin('non-existent-plugin-id')
      }).to.throw(Error, /not found/)
    })

    it('should work', function () {
      expect(
        shellTransform.addPlugin('cordova-plugin-camera')
      ).to.equal(
        'cordova plugin add cordova-plugin-camera'
      )
      expect(
        shellTransform.addPlugin('cc.fovea.cordova.purchase')
      ).to.equal(
        'cordova plugin add cc.fovea.cordova.purchase --variable BILLING_KEY="android/BILLING_KEY"'
      )
    })
  })

  describe('updatePlugin', function () {
    var shellTransform

    before(function () {
      shellTransform = new ShellTransform(config)
    })

    it('should throw an error if plugin doesn\'t exist', function () {
      expect(function () {
        shellTransform.updatePlugin('non-existent-plugin-id')
      }).to.throw(Error, /not found/)
    })

    it('should work', function () {
      expect(
        shellTransform.updatePlugin('cordova-plugin-camera')
      ).to.equal(
        'cordova plugin rm cordova-plugin-camera\ncordova plugin add cordova-plugin-camera'
      )
    })
  })
})
