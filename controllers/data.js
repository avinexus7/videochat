const fileController = require('./fileSystem')

module.exports = {
  getData: async function (collection) {
    const collData = await fileController.getFile(collection)
    return collData
  },
  filterData: async function (collection, query) {
    const collData = await fileController.getFile(collection)
    const filteredData = collData.map((value, i, array) => {
      return value[query.id] === query.value
      /* if (value[query.id] === query.value) {
        return value[i]
      } */
    })
    return filteredData
  },
  addData: async function (collection, data) {
    const saveResp = await fileController.addToFile(collection, data)
    return saveResp
  },
  updateData: function (collection, query, data) {},
  deleteData: async function (collection, query) {
    const deleteResp = await fileController.deleteData(collection, query)
    return deleteResp
  }
}
