const express = require('express')
const router = express.Router()
const MapModel = require('../database/models/map_structure')

// 获取所有地图名称
router.get('/', async (req, res) => {
    MapModel.find({}, "name")
        .exec((err, maps) => {
            err ? res.send(err) : res.json([...new Set(maps.map(map => map.name))]) // 去重
        })
})

// 获取所有地图所有记录
router.get('/ALL', (req, res) => {
    MapModel.find()
        .exec((err, maps) => {
            err ? res.send(err) : res.json(maps)
        })
})

// 获取指定地图所有记录
router.get('/:map_name', (req, res) => {
    let name = req.params.map_name
    MapModel.find({name})
        .exec((err, maps) => {
            err ? res.send(err) : res.json(maps)
        })
})

// 获取指定地图最后记录
router.get('/:map_name/last', (req, res) => {
    let name = req.params.map_name
    MapModel.find({name}).sort("-updated")
        .exec((err, maps) => {
            err ? res.send(err) : res.json(maps[0])
        })
})

// 添加map记录
// TODO 应为高权限操作
router.post('/', (req, res) => {
    delete req.body._id
    delete req.body.updated

    let map = req.body
    MapModel.create(req.body, err => err ? res.send(err) : res.send("Saved"))
})
router.post('/:map_name', (req, res) => {
    delete req.body._id
    delete req.body.updated

    let map = req.body
    map.name = req.params.map_name
    MapModel.create(map, err => err ? res.send(err) : res.send("Saved"))
})

// 删除指定map所有记录
// TODO 应为高权限操作
router.delete('/:map_name', (req, res) => {
    let name = req.params.map_name
    MapModel.deleteMany({name: name}, err => err ? res.send(err) : res.send("Deleted"))
})


module.exports = router
