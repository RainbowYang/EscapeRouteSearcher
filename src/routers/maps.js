const express = require('express')
const router = express.Router()
const { uniq: unique } = require('lodash')
const { MapModel } = require('../database/map')

router.get('/', async (req, res) => {
  let { id, want } = req.query

  // 不设置name表示获取全部
  let conditions = id ? { id } : {}
  let select = want ? { [want]: 1 } : {}

  let result = await MapModel.find(conditions, select).sort({ updated: -1 }) //默认把最新的放在前面
  result = want ? unique(result.map(t => t[want])) : result
  res.json(result)
})

// TODO 应为权限操作
router.post('/', async (req, res) => {
  let { name, nodes, edges } = req.body
  try {
    res.json(await MapModel.create({ name, nodes, edges }))
  } catch (err) {
    res.json(err)
  }
})

// TODO 应为权限操作 警告操作
router.delete('/', async (req, res) => {
  let { id } = req.query

  if (id) {
    let result = await MapModel.remove({ id })
    res.json(result)
  }
})

module.exports = router
