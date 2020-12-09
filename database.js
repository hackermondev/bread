const MongoClient = require('mongodb').MongoClient
var db = null

async function startDatabase() {
  var mongo = await MongoClient.connect(process.env.MONGODB, { useUnifiedTopology: true })
  db = mongo.db('bread')
  console.log(`Connected to database.`)

  module.exports = {
    db: db
  }

  return db
}


module.exports = {
  db: db,
  loadDatabase: startDatabase
}