var _ = require('lodash')

var PluginConfig = require('../../modules/PluginConfig')

var noop = _.noop

describe('PluginConfig', function () {
  var pluginConfig

  beforeEach(function () {
    pluginConfig = new PluginConfig()
  })

  describe('plugins', function () {
    it('should be an array', function () {
      expect(pluginConfig.plugins).to.be.an.array
    })
  })

  describe('add', function () {
    it('should be chainable', function () {
      expect(pluginConfig.add('id', 'spec', noop)).to.equal(pluginConfig)
    })

    it('should add plugin', function () {
      expect(pluginConfig.plugins).to.be.empty
      pluginConfig
        .add('id1')
        .add('id2', 'spec2')
        .add('id3', {})
        .add('id4', 'spec4', {})
      expect(pluginConfig.plugins).to.have.length(4)
      expect(pluginConfig.plugins).to.deep.equal([
        {
          id: 'id1',
          spec: 'id1',
          variables: void 0
        },
        {
          id: 'id2',
          spec: 'spec2',
          variables: void 0
        },
        {
          id: 'id3',
          spec: 'id3',
          variables: {}
        },
        {
          id: 'id4',
          spec: 'spec4',
          variables: {}
        }
      ])
    })
  })

  describe('get', function () {
    it('should throw an error if plugin doesn\'t exist', function () {
      expect(function () {
        pluginConfig.get('platform', 'projectName', 'non-existent-plugin-id')
      }).to.throw(Error, /not found/)
    })

    it('should get w/o variables', function () {
      pluginConfig.add('id', 'spec')

      expect(
        pluginConfig.get('platform', 'projectName', 'id')
      ).to.deep.equal({
        id: 'id',
        spec: 'spec',
        variables: {}
      })

      expect(
        pluginConfig.get(['android', 'ios'], 'projectName', 'id')
      ).to.deep.equal({
        id: 'id',
        spec: 'spec',
        variables: {}
      })
    })

    it('should get static variables', function () {
      pluginConfig.add('id', 'spec', {
        VARIABLE: 'value'
      })

      expect(
        pluginConfig.get('platform', 'projectName', 'id')
      ).to.deep.equal({
        id: 'id',
        spec: 'spec',
        variables: {
          VARIABLE: 'value'
        }
      })

      expect(
        pluginConfig.get(['android', 'ios'], 'projectName', 'id')
      ).to.deep.equal({
        id: 'id',
        spec: 'spec',
        variables: {
          VARIABLE: 'value'
        }
      })
    })

    it('should throw an error due to clashes of variable names between platforms', function () {
      pluginConfig.add('id', 'spec', {
        VARIABLE: function (platform) {
          switch (platform) {
            case 'android':
              return 'value'
            case 'ios':
              return 'another value'
            default:
          }
        }
      })

      expect(function () {
        pluginConfig.get(['android', 'ios'], 'projectName', 'id')
      }).to.throw(Error, 'Can\'t merge')
    })

    it('should get dynamic variables', function () {
      pluginConfig.add('cc.fovea.cordova.purchase', 'cc.fovea.cordova.purchase', {
        BILLING_KEY: function (platform, projectName) {
          if (platform === 'android') {
            switch (projectName) {
              case 'MyFirstApp':
                return 'MyFirstApp/BILLING_KEY'
              case 'MySecondApp':
                return 'MySecondApp/BILLING_KEY'
              default:
            }
          }
        }
      })

      expect(
        pluginConfig.get('android', 'MyFirstApp', 'cc.fovea.cordova.purchase')
      ).to.deep.equal({
        id: 'cc.fovea.cordova.purchase',
        spec: 'cc.fovea.cordova.purchase',
        variables: {
          BILLING_KEY: 'MyFirstApp/BILLING_KEY'
        }
      })

      expect(
        pluginConfig.get('android', 'MySecondApp', 'cc.fovea.cordova.purchase')
      ).to.deep.equal({
        id: 'cc.fovea.cordova.purchase',
        spec: 'cc.fovea.cordova.purchase',
        variables: {
          BILLING_KEY: 'MySecondApp/BILLING_KEY'
        }
      })

      expect(
        pluginConfig.get('ios', 'MyFirstApp', 'cc.fovea.cordova.purchase')
      ).to.deep.equal({
        id: 'cc.fovea.cordova.purchase',
        spec: 'cc.fovea.cordova.purchase',
        variables: {}
      })

      expect(
        pluginConfig.get(['android', 'ios'], 'MyFirstApp', 'cc.fovea.cordova.purchase')
      ).to.deep.equal({
        id: 'cc.fovea.cordova.purchase',
        spec: 'cc.fovea.cordova.purchase',
        variables: {
          BILLING_KEY: 'MyFirstApp/BILLING_KEY'
        }
      })
    })
  })

  describe('getAll', function () {
    it('should get all plugin configs', function () {
      pluginConfig
        .add('cordova-plugin-whitelist', 'cordova-plugin-whitelist')
        .add('cordova-plugin-compat', 'cordova-plugin-compat')

      expect(
        pluginConfig.getAll('platform', 'projectName')
      ).to.deep.equal([
        {
          id: 'cordova-plugin-whitelist',
          spec: 'cordova-plugin-whitelist',
          variables: {}
        },
        {
          id: 'cordova-plugin-compat',
          spec: 'cordova-plugin-compat',
          variables: {}
        }
      ])
    })
  })
})
