const express = require('express')
const router = express.Router()
const maps_model = require('../database/models/maps')

// 获取所有map记录
router.get('/', (req, res) => {
    maps_model.find().exec((err, maps) => {
        res.json(maps)
    })
})

// 获取map最后记录
router.get('/:name', (req, res) => {
    let map_name = req.params.name
    maps_model.find({name: map_name}, "-_id").sort({updated: -1})
        .exec((err, maps) => {
            res.json(maps[0])
        })
})

router.post('/:name', (req, res) => {
    let map = new maps_model(req.body)
    map.save(err => err ? res.send(err) : res.send("Saved"))
})

router.delete('/:name', (req, res) => {
    let map_name = req.params.name
    maps_model.deleteMany({name: map_name}, err => err ? res.send(err) : res.send("Deleted"))
})

router.get('/:name/history', (req, res) => {
    let map_name = req.params.name
    maps_model.find({name: map_name}).exec((err, maps) => {
        res.json(maps)
    })
})

module.exports = router
