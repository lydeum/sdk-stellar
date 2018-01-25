const stellar = require('../lib/stellar')

class Asset {

  constructor(options = {}) {
    this.account = options.account
    this.code = options.code
  }

  create() {
    return new stellar.sdk.Asset(this.code, this.account.key)
  }

}

module.exports = Asset
