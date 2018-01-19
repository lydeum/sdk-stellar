const isProduction = require('./is-production')
const sdk = require('stellar-sdk')

let host = 'https://horizon-testnet.stellar.org'

if(isProduction) {
  host = 'https://horizon.stellar.org'
}

const server = new sdk.Server(host)

if(isProduction) {
  sdk.Network.usePublicNetwork()
}
else {
  sdk.Network.useTestNetwork()
}

module.exports = {
  host,
  sdk,
  server
}
