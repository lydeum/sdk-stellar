const Buffer = require('safe-buffer').Buffer
const stellar = require('../lib/stellar')
const Transactions = require('../transactions')

class Account {

  constructor(options = {}) {

    this.balances = []
    this.data = {}
    this.key = options.key || ''
    this.secret = options.secret || ''

  }

  balance(type) {

    let _balance = null

    for(let i = 0, l = this.balances.length; i < l; i++) {
      const item = this.balances[i]

      if(typeof item.asset_code == 'string' && item.asset_code == type) {
        _balance = item.balance
        break
      }
      else if(item.asset_type == 'native') {
        _balance = item.balance
        break
      }
    }

    return parseFloat(_balance)
  }

  async changeData(data) {
    const transaction = new Transactions({account: this})
    await transaction.open()

    transaction
      .changeData(data)

    await transaction.sign()

    return this
  }

  create() {

    const pair = stellar.sdk.Keypair.random()

    this.key = pair.publicKey()
    this.secret = pair.secret()

  }

  history() {

    return new Promise(async (resolve, reject) => {
      let page = null

      try {
        page = await stellar.server
          .transactions()
          .forAccount(this.key)
          .call()

        resolve(page)
      }
      catch(e) {
        switch(e.data.status) {

          /*
          NOTE: For new accounts, the network can take a few seconds before populating transactions
          */
          case 404:
            page = {
              records: []
            }

            return resolve(page)

          default:
            reject('There was an error connecting to Horizon', e)
        }
      }

    })

  }

  load() {

    return new Promise(async (resolve, reject) => {
      let result = null

      try {
        result = await stellar.server.loadAccount(this.key)
        await this._loadParseData(result)

        return resolve()
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

            await this._loadParseData(result)

            return resolve(result) // TODO: Figure out what the blank object should look like

          default:
            reject('There was an error connecting to Horizon', e)

        }
      }

    })

  }

  _loadParseData(result) {

    return new Promise(async (resolve, reject) => {

      try {
        if(result.balances) {
          this.balances = result.balances
        }

        if(result.data_attr) {
          this.data = {}

          const keys = Object.keys(result.data_attr)
          for(let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i]
            const val = Buffer.from(result.data_attr[key], 'base64').toString('utf8')

            this.data[key] = val
          }

        }

        resolve()
      }
      catch(e) {
        console.error(e)
        reject(e)
      }

    })

  }

}

module.exports = Account
