const friendbot = require('../../../src/friendbot')
const sdk = require('../../../src')

describe('Activity', function onAccounts() {

  it('should stream activity of an account', function(done) {
    this.timeout(25000)

    new Promise(async (resolve, reject) => {

      const account1 = new sdk.Accounts()
      account1.create()
      await friendbot(account1)

      const account2 = new sdk.Accounts()
      account2.create()
      await friendbot(account2)

      try {
        const activity = new sdk.Activity({
          account: account1,
          adaptor: new sdk.Adaptors.Disk({path: '/tmp/stream-token'})
        })
        const transaction = new sdk.Transactions({account: account1})

        transaction
          .addPayment(account2, 500)

        activity.onError(function onPaymentError(e) {
          console.error(e)

          done(e)
        })

        let messageCount = 0
        activity.onMessage(function onPaymentMessage(payment) {
          //console.error('payment', payment)

          messageCount++

          if(messageCount == 2) {
            activity.close()
            expect(payment.paging_token).to.be.a('string')
            done()
          }

        })

        activity.stream()

        await transaction.sign()

      }
      catch(e) {
        console.error(e)
      }

    })

  })

})
