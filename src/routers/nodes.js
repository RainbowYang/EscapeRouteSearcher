const express = require('express')
const router = express.Router()
const node_model = require('../database/models/node_status')

//  获取所有节点实时状态
router.get('/', (req, res) => {
    node_model.find()
        .exec((err, nodes) => {
            err ? res.send(err) : res.json(nodes)
        })
})
//  获取指定地图所有节点实时状态
router.get('/:map_name', (req, res) => {
    let map_name = req.params.map_name
    node_model.find({map_name})
        .exec((err, nodes) => {
            err ? res.send(err) : res.json(nodes)
        })
})
//  获取指定地图指定节点实时状态
router.get('/:map_name/:node_id', (req, res) => {
    let map_name = req.params.map_name
    let id = req.params.node_id
    node_model.find({map_name, id})
        .exec((err, nodes) => {
            err ? res.send(err) : res.json(nodes[0])
        })
})

module.exports = router
