const fileController = require('./fileSystem')
const mongoController = require('./mongo')

module.exports = {
  getData: async function (collection, query) {
    const collData = await mongoController.getData(collection, query)
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
    try {
      const saveResp = await mongoController.addToCollection(collection, data)
      return saveResp
    } catch (error) {
      console.error(error)
      return error
    }
  },
  updateData: function (collection, query, data) {},
  deleteData: async function (collection, query) {
    const deleteResp = await fileController.deleteData(collection, query)
    return deleteResp
  }
}
