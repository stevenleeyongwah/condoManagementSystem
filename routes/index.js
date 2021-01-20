const express = require('express')
const router = express.Router()
const Unit = require('../models/unit')

router.get('/', async (req, res) => {
  let units
  try {
    units = await Unit.find().sort({ date: -1 }).limit(10).exec()
  } catch {
    units = []
  }
  res.render('index', { units: units })
})

module.exports = router