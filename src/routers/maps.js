const express = require('express')
const router = express.Router()
const MapModel = require('../database/models/map_structure')

const unique = arr => [...new Set(arr)]

router.get('/', async (req, res) => {
    let {name, require} = req.query

    let conditions = {}
    if (name) {// 不设置name表示获取全部
        conditions.name = name
    }

    let maps = await MapModel.find(conditions).sort({updated: -1}) //默认把最新的放在前面

    if (require) {
        maps = unique(maps.filter(map => map[require]).map(map => map[require]))
    }

    res.json(maps)
})

// TODO 应为权限操作
router.post('/', async (req, res) => {
    let {name, nodes, edges} = req.body
    let map = {name, nodes, edges}
    try {
        let saved_map = await MapModel.create(map)
        res.send(saved_map)
    } catch (err) {
        console.error(err)
        res.send(err)
    }
})

// TODO 应为权限操作 警告操作
router.delete('/', async (req, res) => {
    let {name} = req.query

    if (name) {
        let result = await MapModel.remove({name})
        res.json(result)
    } else {
        res.send("'name' is required")
    }
})


module.exports = router
