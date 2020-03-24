const express = require('express')
const router = express.Router()
const NodeModel = require('../database/models/node_status')

router.get('/', async (req, res) => {
    let {map_name, id} = req.query

    let conditions = {}
    if (map_name) {// 不设置name表示获取全部
        conditions.map_name = map_name
    }
    if (id) {
        conditions.id = id
    }

    let nodes = await NodeModel.find(conditions)

    res.json(nodes)
})

module.exports = router
