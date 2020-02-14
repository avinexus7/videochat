const userOps = require('./user')

module.exports = {
  connectWithOppositeParty: async function (userData) {
    if (!userData) { throw new Error('user data not given') } else if (!userData.party) { throw new Error('user party not given') }
    const oppositeParty = module.exports.getOppositeParty(userData.party)
    userData.oppositeParty = oppositeParty
    userData.busy = false
    await module.exports.saveUserDetails(userData)
    const oppositePartyUser = await module.exports.findParty(userData.oppositeParty)
    if (oppositePartyUser.success) {
      await module.exports.makePartiesBusy(oppositePartyUser.user, userData)
    }
    return oppositePartyUser
  },
  makePartiesBusy: function (party1, party2) {

  },
  saveUserDetails: async function (userData) {
    const saveResp = await userOps.addToOnlineUsers(userData)
    console.log(saveResp)
    return saveResp
  },
  findParty: async function (party) {
    const oppPartyOnlineFreeUsers = await userOps.getOtherPartyOnlineFreeUsers(party)
    var onlineFreeUser
    if (oppPartyOnlineFreeUsers.length) {
      const randomUser = module.exports.generateRandomNumber(oppPartyOnlineFreeUsers.length)
      onlineFreeUser = oppPartyOnlineFreeUsers[randomUser]
    } else {
      return { success: false, message: 'no online user found for party ' + party }
    }
    return { success: true, user: onlineFreeUser }
  },
  generateRandomNumber: function (length) {
    return Math.floor(Math.random() * length)
  },
  getOppositeParty: function (party) {
    var oppositeParty = ''
    switch (party) {
      case 'supporter':
        oppositeParty = 'curious'
        break
      case 'curious':
        oppositeParty = 'supporter'
        break
      default:
        break
    }
    return oppositeParty
  }
}
