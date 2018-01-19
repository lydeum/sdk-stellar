const stellar = require('../lib/stellar')

class Transactions {

  constructor(options = {}) {

    this._accounts = [options.sourceAccount]
    this.sourceAccount = options.sourceAccount

  }

  addMemo(text) {
    this._transaction.addMemo(stellar.sdk.Memo.text(text))

    return this
  }

  addPayment(destinationAccount, amount, assetType) {
    this._pushAccount(destinationAccount)

    let asset = stellar.sdk.Asset.native()

    if(assetType) {
      asset = assetType
    }

    this._transaction.addOperation(stellar.sdk.Operation.payment({
      amount: amount.toString(),
      asset,
      destination: destinationAccount.key
    }))

    return this

  }

  async open() {

    this._transaction = new stellar.sdk.TransactionBuilder(await stellar.server.loadAccount(this.sourceAccount.key))

    return this
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
      const transaction = this._transaction.build()

      transaction.sign(stellar.sdk.Keypair.fromSecret(this.sourceAccount.secret))

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
