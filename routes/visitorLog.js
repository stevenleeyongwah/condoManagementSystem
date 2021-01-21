const express = require('express')
const router = express.Router()
const Visitor = require('../models/visitor')
const Unit = require('../models/unit')
const VisitorLog = require('../models/visitorLog')

/**
 * @route   GET visitorLog/new/:id
 * @desc    :id = ID of visitor. This allows user to add visit log for visitor
 */
router.get('/new/:id', (req, res) => {
  let visitorLog = new VisitorLog({
    visitor_id: req.params.id
  })

  try {
    res.render('visitorLog/new', { 
      visitorLog, 
      unit: new Unit(), 
      action: '/visitorLog', // This will send POST action to visitorLog POST route
    })
  } catch (err) {
    res.redirect('/')
  }
})

/**
 * @route   GET visitorLog/:id
 * @desc    :id = ID of visitor. This will render visitor detail & visitor logs
 */
router.get('/:id', async (req, res) => {
  try {
    // Get visitor info using visitor ID
    const visitor = await Visitor.findOne({ _id: req.params.id })

    // Get visitor logs using visitor ID
    const visitorLog = await VisitorLog.find({ visitor_id: req.params.id }).sort({ createdAt: -1 }).exec()
    
    // Render visitorLog index page
    res.render('visitorLog/index', { visitor, visitorLog })
  } catch (err) {
    res.redirect('/')
  }
})

// Create Visit Log Route
router.post('/', async (req, res) => {
  try {
    const unit = await Unit.findOne({ blockUnitNumber: req.body.blockUnitNumber })
    
    if (!unit) {
      let errors = { blockUnitNumber: `${req.body.blockUnitNumber} does not exist` }
      res.status(400).json({ errors });
    }

    const visitorLog = new VisitorLog({
      visitor_id: req.body.visitor_id,
      blockUnitNumber: unit.blockUnitNumber,
      entryDateTime: req.body.entryDateTime,
      exitDateTime: req.body.exitDateTime
    })

    const saveVisitorLog = await visitorLog.save();
    
    res.status(201).json({ saveVisitorLog, redirect: `/visitorLog/${req.body.visitor_id}` });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
})

router.get('/:id', async (req, res) => {
  const visitorLog = await VisitorLog.findOne({ _id: req.params.id })

  if (visitor == null) res.redirect('/')
  res.render('visitor/detail', { visitor })
})

router.get('/edit/:id', async (req, res) => {
  let visitorLog = await VisitorLog.findById(req.params.id)
  
  // // visitorLog.entryDateTime = substring(0, visitorLog.entryDateTime.length - 1);
  // console.log(visitorLog.entryDateTime.toDateString())
  // console.log(visitorLog.entryDateTime.toISOString().slice(0, -1))
  // visitorLog.entryDateTime = visitorLog.entryDateTime.toISOString().slice(0, -1)
  // console.log(visitorLog)

  res.render('visitorLog/edit', { visitorLog, action: `/visitorLog/${visitorLog.id}?_method=PUT`, redirect: '/visitorLog' })
})

router.put('/:id', async (req, res) => {
  console.log("I am in put")
  try {
    const unit = await Unit.findOne({ blockUnitNumber: req.body.blockUnitNumber })
    
    if (!unit) {
      let errors = { blockUnitNumber: `${req.body.blockUnitNumber} does not exist` }
      res.status(400).json({ errors });
    }

    let visitorLog = await VisitorLog.findById(req.params.id)

    visitorLog.visitor_id = req.body.visitor_id
    visitorLog.blockUnitNumber = req.body.blockUnitNumber
    visitorLog.entryDateTime = req.body.entryDateTime
    visitorLog.exitDateTime = req.body.exitDateTime

    const saveVisitorLog = await visitorLog.save();
    
    res.status(201).json({ saveVisitorLog, redirect: `/visitorLog/${req.body.visitor_id}` });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
})

router.delete('/:visitor_id/:id', async (req, res) => {
  try {
    await VisitorLog.findByIdAndDelete(req.params.id)
    res.redirect(`/visitorLog/${req.params.visitor_id}`)
  } catch(err) {
    res.json({ err: 'Fail to delete' })
  }
})

module.exports = router