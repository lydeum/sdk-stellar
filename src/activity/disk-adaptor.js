const fs = require('fs')
const path = require('path')

class PagingTokenDiskAdaptor {

  constructor(options = {}) {
    this.path = options.path
  }

  load() {
    return new Promise(async (resolve, reject) => {

      try {
        const token = fs.readFileSync(this.path, 'utf8')

        resolve(token)
      }
      catch(e) {
        reject(e)
      }

    })
  }

  save(token) {
    try {
      fs.writeFileSync(this.path, token, 'utf8')
    }
    catch(e) {
      console.error('Could not save token', e)
    }
  }

}

module.exports = PagingTokenDiskAdaptor
