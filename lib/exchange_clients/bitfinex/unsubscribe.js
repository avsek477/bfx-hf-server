'use strict'

const chanDataToKey = require('../../util/chan_data_to_key')
const chanDataToSubscribePacket = require('./util/chan_data_to_subscribe_packet')

module.exports = (exa, channelData) => {
  const { d, ws, subs, channelMap, pendingSubs } = exa

  const cdKey = chanDataToKey(channelData)
  const chanID = subs[cdKey]

  if (!chanID) {
    d('tried to unsub from unknown channel', chanID)
    return
  }

  d('unsubscribing from channel %s', chanID)

  const filter = chanDataToSubscribePacket(channelData)

  switch (channelData[0]) {
    case 'trades': {
      ws.managedUnsubscribe('trades', filter)
      break
    }

    default: {
      throw new Error('unknown channel type: %j', channelData)
    }
  }

  delete subs[cdKey]
  delete channelMap[`${chanID}`]
  delete pendingSubs[cdKey]

  return chanID
}
