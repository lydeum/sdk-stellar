const stellar = require('../lib/stellar')

class Transactions {

  constructor(options = {}) {

    this.account = options.account
    this._accounts = [options.account]
    this.signers = [options.account]

    this._transaction = this.open()

  }

  addMemo(text) {
    this
      ._transaction
      .then((transaction) => transaction.addMemo(stellar.sdk.Memo.text(text)))

    return this
  }

  addOptions(options = {}) {
    this
      ._transaction
      .then((transaction) => transaction.addOperation(stellar.sdk.Operation.setOptions(options)))

    return this

  }

  addPayment(destinationAccount, amount, assetType) {

    this._pushAccount(destinationAccount)

    let asset = stellar.sdk.Asset.native()

    if(assetType) {
      asset = assetType
    }

    this
      ._transaction
      .then((transaction) => transaction.addOperation(stellar.sdk.Operation.payment({
        amount: amount.toString(),
        asset,
        destination: destinationAccount.key
      })))

    return this

  }

  addSigner(destinationAccount, weight = 1) {

    this._pushAccount(destinationAccount)

    this
      ._transaction
      .then((transaction) => transaction.addOperation(stellar.sdk.Operation.setOptions({
        signer: {
          ed25519PublicKey: destinationAccount.key,
          weight
        }
      })))

    return this
  }

  changeData(data) {

    const options = {}

    const keys = Object.keys(data)
    for(let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i]

      options.name = key
      options.value = data[key]
    }

    this
      ._transaction
      .then((transaction) => transaction.addOperation(stellar.sdk.Operation.manageData(options)))

    return this
  }

  changeTrust(asset, limit) {

    const options = {
      asset
    }

    if(limit) {
      options.limit = limit
    }

    this
      ._transaction
      .then((transaction) => transaction.addOperation(stellar.sdk.Operation.changeTrust(options)))

    return this
  }

  cosign(cosignAccount) {
    this._pushAccount(cosignAccount)

    this.signers.push(cosignAccount)

    return this
  }

  async open() {

    return new Promise(async (resolve, reject) => {

      try {
        const transaction = new stellar.sdk.TransactionBuilder(await stellar.server.loadAccount(this.account.key))

        resolve(transaction)
      }
      catch(e) {
        reject(e)
      }

    })
  }

  _pushAccount(account) {

    let inList = false

    for(let i = 0, l = this._accounts.length; i < l; i++) {
      const _account = this._accounts[i]

      if(account.key == _account.key) {
        inList = true
      }
    }

    // If the account is not in the list
    if(!inList) {
      this._accounts.push(account)
    }

  }

  async sign() {

    try {
      const _transaction = await this._transaction
      const transaction = _transaction.build()

      // Add all signers
      for(let i = 0, l = this.signers.length; i < l; i++) {
        const account = this.signers[i]

        transaction.sign(stellar.sdk.Keypair.fromSecret(account.secret))
      }

      const result = await stellar.server.submitTransaction(transaction)

      // Reload accounts after successful transaction
      const reloadAccounts = []
      for(let i = 0, l = this._accounts.length; i < l; i++) {
        const account = this._accounts[i]

        reloadAccounts.push(account.load())
      }

      await Promise.all(reloadAccounts)

      //console.log(JSON.stringify(result, null, 2))
      //console.log('\nSuccess! View the transaction at: ', result._links.transaction.href)

      return result
    }
    catch(e) {
      console.error('Could not sign transaction', e)
    }

  }

}

module.exports = Transactions
