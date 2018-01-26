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

  it('should add a second (required) signature to account', async function() {
    this.timeout(30000)

    const account1 = new sdk.Accounts()
    account1.create()
    await friendbot(account1)

    const account2 = new sdk.Accounts()
    account2.create()
    await friendbot(account2)

    const account3 = new sdk.Accounts()
    account3.create()
    await friendbot(account3)

    const transaction1 = new sdk.Transactions({account: account1})
    await transaction1.open()

    transaction1
      .addSigner(account2) // Default weight is 1
      .addOptions({
        masterWeight: 1, // set master key weight
        lowThreshold: 1,
        medThreshold: 2, // a payment is medium threshold
        highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
      })

    // account1 now needs account2 for signatures
    await transaction1.sign()

    const transaction2 = new sdk.Transactions({account: account1})
    await transaction2.open()

    transaction2
      .addPayment(account3, 500)
      .cosign(account2) // account2 now must cosign with account1

    await transaction2.sign()

    expect(account1.balance()).to.equal(9499.99997) // Fees, yo
    expect(account2.balance()).to.equal(10000)
    expect(account3.balance()).to.equal(10500)

  })

})
