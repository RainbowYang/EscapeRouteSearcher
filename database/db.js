const MongoClient = require('mongodb').MongoClient

const mg = require("../config.json").mongodb

const url = `mongodb://${mg.ip}:${mg.port}/${mg.location}`
const options = {auth: mg.auth}

const getCollection = async (name) =>
    new Promise((resolve, reject) =>
        MongoClient.connect(url, options,
            (err, client) =>
                err ? reject(err) :
                    resolve(client.db(mg.location).collection(name))))

const maps_coll = () => getCollection("maps")
const nodes_coll = () => getCollection("nodes")

module.exports = {getCollection, maps_coll, nodes_coll}