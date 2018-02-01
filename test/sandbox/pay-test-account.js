process.on('uncaughtException', function(err) {
  console.error(err)
})

process.on('unhandledRejection', function(err) {
  console.error(err)
})

function wait(ms) {
  return new Promise( (resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

const friendbot = require('../../src/friendbot')
const sdk = require('../../src')

async function task() {

  try {
    const account1 = new sdk.Accounts()
    console.log('Account created')
    //await friendbot('GCWNHSMLO465SPDOMQR2YSUJT7OGGDF63MAZ2JGDE7LTZUVGP5WGWKAH')
    await friendbot(account1)
    console.log('Account funded')
    const transaction = new sdk.Transactions({account: account1})
    console.log('Transaction started')
    transaction
      .addPayment('GBG4QUUNHERCTAMCXMEYKCFM7N2IEI3SGSEC5ER4MQGQU6LC3EDB3WTH', 500)

    await transaction.sign()
    console.log('Transaction signed')
    await wait(5000)
    const transactions = await account1.history()
    console.log('Transaction history loaded')
    console.log(transactions)
  }
  catch(e) {
    console.error(e)

    if(e.data && e.data.extras && e.data.extras.result_codes) {
      console.log('Extras', e.data.extras.result_codes)
    }
  }
}

task()
