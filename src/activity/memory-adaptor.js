const store = {}

class PagingTokenMemoryAdaptor {

  constructor(options = {}) {
    this.path = options.path
  }

  load() {
    return new Promise(async (resolve, reject) => {

      try {
        const token = store.token

        resolve(token)
      }
      catch(e) {
        reject(e)
      }

    })
  }

  save(token) {
    try {
      store.token = token
    }
    catch(e) {
      console.error('Could not save token', e)
    }
  }

}

module.exports = PagingTokenMemoryAdaptor
