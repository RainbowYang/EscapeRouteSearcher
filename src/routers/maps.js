const express = require('express')
const router = express.Router()
const maps_model = require('../database/models/maps')

// 获取所有map记录名称
router.get('/', (req, res) => {
    maps_model.find({}, "name")
        .exec((err, maps) => {
            err ? res.send(err) : res.json(maps.map(map => map.name))
        })
})

// 获取指定map最后记录
router.get('/:name', (req, res) => {
    let map_name = req.params.name
    maps_model.find({name: map_name}).sort({updated: -1})
        .exec((err, maps) => {
            err ? res.send(err) : res.json(maps[0])
        })
})

// 获取指定map所有记录
router.get('/:name/history', (req, res) => {
    let map_name = req.params.name
    maps_model.find({name: map_name})
        .exec((err, maps) => {
            err ? res.send(err) : res.json(maps)
        })
})

// 添加map记录
// TODO 应为高权限操作
router.post('/', (req, res) => {
    delete req.body._id
    delete req.body.updated

    maps_model.create(req.body, err => err ? res.send(err) : res.send("Saved"))
})

// 删除指定map所有记录
// TODO 应为高权限操作
router.delete('/:map_name', (req, res) => {
    let map_name = req.params.map_name
    maps_model.deleteMany({name: map_name}, err => err ? res.send(err) : res.send("Deleted"))
})


module.exports = router
