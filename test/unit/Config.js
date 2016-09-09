var Config = require('../../modules/Config')

describe('Config', function () {
  var config

  before(function () {
    config = new Config()
  })

  describe('addPlatform', function () {
    it('should be chainable', function () {
      expect(
        config.addPlatform('platform')
      ).to.equal(config)
    })

    it('should add a platform', function () {
      config.addPlatform('platform')
      expect(
        config._platforms[0]
      ).to.equal('platform')
    })
  })

  describe('setProjectName', function () {
    it('should be chainable', function () {
      expect(
        config.setProjectName('projectName')
      ).to.equal(config)
    })

    it('should set project name', function () {
      config.setProjectName('projectName')
      expect(
        config._projectName
      ).to.equal('projectName')
    })
  })

  describe('addPlugin', function () {
    it('should be chainable', function () {
      expect(
        config.addPlugin('id')
      ).to.equal(config)
    })
  })
})
