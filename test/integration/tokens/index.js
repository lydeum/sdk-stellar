const friendbot = require('../../../src/friendbot')
const sdk = require('../../../src')

describe('Tokens', function onAccounts() {

  it('should create a new token', function(done) {
    this.timeout(25000)

    new Promise(async (resolve, reject) => {

      const empire = new sdk.Accounts()
      empire.create()
      await friendbot(empire)

      // Create asset and assign to account
      const asset = new sdk.Asset({account: empire, code: 'SHIELD'})
      const shield = await asset.create()

      expect(shield.code).to.equal('SHIELD')
      expect(shield.issuer).to.equal(empire.key)

      done()

    })

  })

  it('should send a token to another account', function(done) {
    this.timeout(25000)

    new Promise(async (resolve, reject) => {

      const empire = new sdk.Accounts()
      empire.create()
      await friendbot(empire)

      // Create a new asset (as token)
      const asset = new sdk.Asset({account: empire, code: 'SHIELD'})
      const shield = await asset.create()

      const endor = new sdk.Accounts()
      endor.create()
      await friendbot(endor)

      // The receiving account must first accept the trust of the issuer
      const transaction1 = new sdk.Transactions({account: endor})

      // Add the asset (shield) as a trusted asset for endor
      transaction1
        .changeTrust(shield)

      await transaction1.sign()
      await endor.load()

      expect(endor.balance('SHIELD')).to.equal(0.0000000)

      // Empire sends 1 shield to Endor
      const transaction2 = new sdk.Transactions({account: empire})

      transaction2
        .addPayment(endor, 1, shield)

      await transaction2.sign()

      await endor.load()

      expect(endor.balance('SHIELD')).to.equal(1)

      done()

    })
  })

})
