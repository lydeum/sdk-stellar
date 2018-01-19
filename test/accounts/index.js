const friendbot = require('../../src/friendbot')
const sdk = require('../../src')

describe('Accounts', function onAccounts() {

  it('should initialize an empty constructor', function() {

    const account = new sdk.Accounts()

    expect(account.balances.length).to.equal(0)
    expect(account.key).to.equal('')
    expect(account.secret).to.equal('')

  })

  it('should create an account', function() {

    const account = new sdk.Accounts()
    account.create()

    expect(account.key).to.be.a('string')
    expect(account.secret).to.be.a('string')

  })

  it('should load an empty account', async function() {

    const account = new sdk.Accounts()
    account.create()
    await account.load()

    expect(account.balances[0].balance).to.equal(0)

  })

  it('should load an active account', async function() {
    this.timeout(10000)

    const account = new sdk.Accounts()
    account.create()
    await friendbot(account)
    await account.load()

    expect(account.balances[0].balance > 0).to.be.true

  })

})
