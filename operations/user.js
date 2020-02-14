const dataOps = require('../controllers/data')

module.exports = {
  addUser: async function (userData) {
    dataOps.addData()
  },
  updateUser: function (userData) {

  },
  getUser: function (userData) {

  },
  getOtherPartyOnlineFreeUsers: async function (party) {
    const onlineUsers = await dataOps.getData('onlineUsers', { party: party, busy: !1 })
    return onlineUsers
  },
  deleteUser: function (userData) {

  },
  addToOnlineUsers: async function (userData) {
    const resp = await dataOps.addData('onlineUsers', userData)
    return resp
  },
  reomveFromOnlineUsers: function () {

  },
  loginUser: function () {},
  logoutUser: function () {}
}
