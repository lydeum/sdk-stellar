const stellar = require('../lib/stellar')

class Activity {

  constructor(options = {}) {
    this.account = options.account
    this._close = function onClose() {}
    this._onError = function onError() {}
    this._onMessage = function onMessage() {}
    this.pagingToken = null
    this.pagingTokenAdaptor = null
    this.streaming = false
  }

  close() {
    if(this.streaming) {
      this._close()
      this.streaming = false
    }

  }

  onError(fn) {
    if(this.streaming) {return}
    this._onError = fn
  }

  onMessage(fn) {
    if(this.streaming) {return}
    this._onMessage = fn
  }

  setPagingTokenAdaptor(adaptor) {
    this.pagingTokenAdaptor = adaptor
  }

  async stream() {
    const _this = this

    if(!this.streaming) {
      const payments = stellar.server.payments().forAccount(this.account.key)

      if(this.pagingTokenAdaptor) {
        const previousToken = await this.pagingTokenAdaptor.load()

        if(previousToken) {
          payments.cursor(previousToken)
        }
      }

      this.streaming = true
      this._close = payments
        .stream({
          onmessage: function onMessageWrapper(payment) {

            if(this.pagingTokenAdaptor) {
              _this.pagingTokenAdaptor.save(payment.paging_token)
            }

            _this._onMessage.call(this, payment)

          },
          onerror: this._onError
        })
    }

  }

}

module.exports = Activity
