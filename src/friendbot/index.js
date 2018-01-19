const request = require('superagent')
const stellar = require('../lib/stellar')

module.exports = async function friendbot(account) {

  const url = `${stellar.host}/friendbot?addr=${account.key}`

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
