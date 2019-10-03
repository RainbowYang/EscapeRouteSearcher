const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://118.25.49.70:27017/bluetooth'
const options = {
    auth: {
        user: 'admin',
        password: 'blue'
    }
}

exports.getDatabase = (name) =>
    new Promise((resolve, reject) =>
        MongoClient.connect(url, options, (err, client) => err ? reject(err) : resolve(client.db(name))))
