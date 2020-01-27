var fs = require('fs')

module.exports = {
  getFile: function (fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, function (err, fileData) {
        if (err) reject(err)
        var json = JSON.parse(fileData)
        resolve(json)
      })
    })
  },
  addToFile: function (fileName, incomingData) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, function (err, fileData) {
        if (err) reject(err)
        try {
          var json = JSON.parse(fileData)
          json.push(incomingData)
          fs.writeFile(fileName, JSON.stringify(json))
          resolve({ success: true })
        } catch (error) {
          reject(error)
        }
      })
    })
  },
  removeFromFile: function (fileName, query) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, function (err, fileData) {
        if (err) reject(err)
        var json = JSON.parse(fileData)
        if (Array.isArray(json)) {
          try {
            // delete json[query.id]
            json.map((arrayObj, index, array) => {
              if (arrayObj[query.id] === query.value) {
                delete json[index]
              }
            })
            resolve({ success: true })
          } catch (error) {
            reject(new Error('could not delete, probably does not exist'))
          }
        } else {
          reject(new Error('imported file not of type json'))
        }
        try {
          json.push(json)
        } catch (error) {
          reject(new Error('could not add to file, please check'))
        }
        fs.writeFile(fileName, JSON.stringify(json))
      })
    })
  }
}
