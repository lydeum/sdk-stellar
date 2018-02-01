const request = require('superagent')
const stellar = require('../lib/stellar')

module.exports = async function friendbot(account) {

  let key = null

  if(typeof account == 'object') {
    key = account.key
  }
  else {
    key = account
  }

  const url = `${stellar.host}/friendbot?addr=${key}`

  return new Promise(async (resolve, reject) => {

    try {
      const result = await request.get(url)

      resolve(result)
    }
    catch(e) {
      reject(e)
    }

  })

}
