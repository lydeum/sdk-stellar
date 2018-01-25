const friendbot = require('../../../src/friendbot')
const sdk = require('../../../src')

describe('Transactions', function onTransactions() {

  it('should send XLM from one account to another', async function() {
    this.timeout(25000)

    const account1 = new sdk.Accounts()
    account1.create()
    await friendbot(account1)

    const account2 = new sdk.Accounts()
    account2.create()
    await friendbot(account2)

    const transaction = new sdk.Transactions({account: account1})
    await transaction.open()

    transaction
      .addPayment(account2, 500)

    await transaction.sign()
    //console.error('account1', account1)
    //console.error('account2', account2)
    expect(account2.balance() > account1.balance()).to.be.true

  })

})
