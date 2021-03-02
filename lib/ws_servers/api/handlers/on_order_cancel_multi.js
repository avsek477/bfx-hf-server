'use strict'

const sendError = require('../../../util/ws/send_error')
const validateParams = require('../../../util/ws/validate_params')
const isAuthorized = require('../../../util/ws/is_authorized')

const cancelOrderMultiBitfinex = require('../cancel_order_multi_bitfinex')

module.exports = async (server, ws, msg) => {
  const { d } = server
  const [, authToken, packet] = msg
  const validRequest = validateParams(ws, {
    authToken: { type: 'string', v: authToken },
    packet: { type: 'object', v: packet }
  })

  if (!validRequest) {
    return
  }

  if (!isAuthorized(ws, authToken)) {
    return sendError(ws, 'Unauthorized')
  } else if (!ws.clients.bitfinex) {
    return sendError(ws, `No client open for Bitfinex`)
  }

  await cancelOrderMultiBitfinex(d, ws, ws.clients.bitfinex, packet)
}
