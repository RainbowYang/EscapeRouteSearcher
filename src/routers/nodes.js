const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.get('/:map_id', async (req, res) => {
  res.json(await db.node_status.getFrom(req.params.map_id))
})

module.exports = router
