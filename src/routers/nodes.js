const express = require('express')
const router = express.Router()
const { NodeStatusModel } = require('../database/node_status')

router.get('/', async (req, res) => {
  let { map_id, node_id } = req.query

  if (!map_id) {
    res.send('No map id')
  }

  let conditions = node_id ? { id: node_id, map_id } : { map_id }
  res.json(await NodeStatusModel.find(conditions))
})

module.exports = router
