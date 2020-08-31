const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.get('/:id/last', async (req, res) => {
  res.json(await db.map.getLast(req.params.id))
})

router.get('/:id', async (req, res) => {
  res.json(await db.map.get(req.params.id))
})

router.get('/', async (req, res) => {
  res.json(await db.map.getIds())
})

// TODO 应为权限操作
router.post('/', async (req, res) => {
  res.json(await db.map.add(req.body))
})

// TODO 应为权限操作 警告操作
router.delete('/:id', async (req, res) => {
  res.json(await db.map.delete(req.params.id))
})

module.exports = router
