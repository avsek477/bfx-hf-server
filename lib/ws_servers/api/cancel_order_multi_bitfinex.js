'use strict'

const {
  notifyInfo,
  notifyOrderCancelled,
  notifyErrorBitfinex
} = require('../../util/ws/notify')

module.exports = async (d, ws, bfxClient, packet) => {
  notifyInfo(ws, 'Cancelling orders on Bitfinex')

  try {
    await bfxClient.cancelOrderMulti(packet)

    d('sucessfully cancelled order [bitfinex]')

    // notifyOrderCancelled(ws, 'bitfinex', {
    //   amount: order[7],
    //   symbol: order[3],
    //   price: order[16],
    //   type: order[8]
    // })
  } catch (error) {
    d('failed to cancel group orders [bitfinex]')
    notifyErrorBitfinex(ws, error)
  }
}
