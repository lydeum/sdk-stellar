const stellar = require('../lib/stellar')

class Account {

  constructor(options = {}) {

    this.balances = []
    this.key = options.key || ''
    this.secret = options.secret || ''

  }

  balance(type) {
    return parseFloat(this.balances[0].balance)
  }

  create() {

    const pair = stellar.sdk.Keypair.random()

    this.key = pair.publicKey()
    this.secret = pair.secret()

  }

  load() {

    return new Promise(async (resolve, reject) => {
      let result = null

      try {
        result = await stellar.server.loadAccount(this.key)
        this._loadParseData(result)
        return resolve(result)
      }
      catch(e) {

        switch(e.data.status) {

          case 404:
            result = {
              id: this.key,
              account_id: this.key,
              balances: [{balance: 0, asset_type: 'native'}],
              data: {}
            }

            this._loadParseData(result)

            return resolve(result) // TODO: Figure out what the blank object should look like

          default:
            reject('There was an error connecting to Horizon', e)

        }
      }

    })

  }

  _loadParseData(result) {

    if(result.balances) {
      this.balances = result.balances
    }

  }

}

module.exports = Account
