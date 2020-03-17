const express = require('express')
const router = express.Router()
const nodes_model = require('../database/models/nodes')

//  获取指定map所有节点实时状态
router.get('/:map_name', (req, res) => {
    let map_name = req.params.map_name
    nodes_model.find({map_name})
        .exec((err, nodes) => {
            err ? res.send(err) : res.json(nodes)
        })
})
//  获取指定map指定节点实时状态
router.get('/:map_name/:id', (req, res) => {
    let map_name = req.params.map_name
    let id = req.params.id
    nodes_model.find({map_name, id})
        .exec((err, nodes) => {
            err ? res.send(err) : res.json(nodes[0])
        })
})

module.exports = router
