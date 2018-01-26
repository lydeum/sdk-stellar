const friendbot = require('../../../src/friendbot')
const sdk = require('../../../src')

describe('Accounts', function onAccounts() {

  it('should create an empty account', function() {

    const account = new sdk.Accounts()

    expect(account.balances.length).to.equal(0)
    expect(account.key.length > 0).to.be.true
    expect(account.secret.length > 0).to.be.true

  })

  it('should load an empty account', async function() {

    const account = new sdk.Accounts()
    await account.load()

    expect(account.balances[0].balance).to.equal(0)

  })

  it('should load an active account', async function() {
    this.timeout(10000)

    const account = new sdk.Accounts()
    await friendbot(account)
    await account.load()

    expect(account.balances[0].balance > 0).to.be.true

  })

  it('should get account history', async function() {
    this.timeout(10000)

    const account = new sdk.Accounts()
    await friendbot(account)
    const page = await account.history()
    //console.log('page', page)
    expect(page.records instanceof Array).to.be.true

  })

  it('should store data to an account', function(done) {
    this.timeout(15000)

    new Promise(async (resolve, reject) => {

      const account = new sdk.Accounts()
      await friendbot(account)

      await account.changeData({foo: 'bar'})
      await account.load()

      expect(account.data.foo).to.equal('bar')
      done()

    })
  })

})
