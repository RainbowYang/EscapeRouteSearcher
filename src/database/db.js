const config = require("../../config.json").mongodb

const url = `mongodb://${config.ip}:${config.port}/${config.location}`
const options = {auth: config.auth, useNewUrlParser: true, useUnifiedTopology: true}

const MongoClient = require('mongodb').MongoClient
const getCollection = async (name) =>
    new Promise((resolve, reject) =>
        MongoClient.connect(url, options,
            (err, client) =>
                err ? reject(err) :
                    resolve(client.db(config.location).collection(name))))

const maps_coll = () => getCollection("maps")
const nodes_coll = () => getCollection("nodes")

module.exports = {getCollection, maps_coll, nodes_coll}
// // 导入 mongoose 模块
// const mongoose = require('mongoose')
// const config = require("../../config.json").mongodb
//
// const url = `mongodb://${config.ip}:${config.port}/${config.location}`
// const options = {auth: config.auth}
//
// mongoose.connect(url, options)
// // 让 mongoose 使用全局 Promise 库
// mongoose.Promise = global.Promise
// // 取得默认连接
// const db = mongoose.connection
//
// // 将连接与错误事件绑定（以获得连接错误的提示）
// db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))

