var MongoClient = require('mongodb').MongoClient
const parser = { useNewUrlParser: true, useUnifiedTopology: true }
const config = require('../config')
const mongoUrl = `mongodb://sxp:sxptECHSOPHY@${config.mongo.host}:${config.mongo.port}`

var db = null

MongoClient.connect(mongoUrl, parser, (err, client) => {
  if (err) { console.error('mongo connect error', err) }
  db = client.db(config.mongo.database)
})

module.exports.addToCollection = function (collName, data) {
  const collection = db.collection(collName)
  return new Promise((resolve, reject) => {
    collection.insertOne(data, {}, (err, resp) => {
      if (err) {
        console.error('failed to insert documents from collection ' + collName + ', error: ' + JSON.stringify(err))
        reject(err)
      } else {
        resolve(resp)
      }
    })
  })
}

module.exports.getData = function (collName, query) {
  const collection = db.collection(collName)
  return new Promise((resolve, reject) => {
    collection.find(query).toArray((err, resp) => {
      if (err) {
        console.error('failed to fetch documents from collection ' + collName + ', with query ' + JSON.stringify(query) + ', with err: ' + JSON.stringify(err))
        reject(err)
      } else {
        resolve(resp)
      }
    })
  })
}
