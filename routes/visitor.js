const express = require('express')
const router = express.Router()
const Visitor = require('../models/visitor')
const VisitorLog = require('../models/visitorLog')

/**
 * @desc Error handling
 */
const handleErrors = (err) => {
    let errors = { name: '', contactNumber: '', last3DigitNRIC: '' };

    // duplicate unit number error
    if (err.code === 11000) {
      errors[Object.keys(err.keyValue)[0]] = `${err.keyValue[Object.keys(err.keyValue)[0]]} is already registered`;
      return errors;
    }

    // validation errors
    if (err.message.includes('Invalid format of visitor name') || 
        err.message.includes('Invalid format of contact number') ||
        err.message.includes('Invalid format of NRIC')
    ) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

/**
 * @route   GET /visitor
 * @desc    This will render all visitors in index page
 */
router.get('/', async (req, res) => {
  let searchOptions = { name: '' }

  if (req.query.name) {
    searchOptions.name = req.query.name
  }

  try {
    let visitors = await Visitor.find({
      name: {'$regex': searchOptions.name, '$options': 'i'}
    }).sort({ createdAt: -1 }).limit(10).exec()

    res.render('visitor/index', { visitors, searchOptions })
  } catch(err) {
    res.json({ err })
  }
})

/**
 * @route   GET /visitor/new
 * @desc    This allow user to add new visitor
 */
router.get('/new', (req, res) => {
  res.render('visitor/new', { visitor: new Visitor(), action: '/visitor' })
})

/**
 * @route   GET /visitor/edit/:id
 * @desc    This allow user to edit visitor info
 */
router.get('/edit/:id', async (req, res) => {
  try {
    // Look for visitor in mongoDB with specific ID
    const visitor = await Visitor.findById(req.params.id)

    // If visitor does not exist, then redirect to /visitor
    if (visitor == null) res.redirect('/visitor')

    // Render edit page
    res.render('visitor/edit', { visitor, action: `/visitor/${visitor.id}?_method=PUT` })
  } catch (err) {
    res.json({ err })
  }

})

/**
 * @route   POST /visitor
 * @desc    This will accept POST data and save visitor data to mongoDB
 */
router.post('/', async (req, res) => {
  const visitor = new Visitor({
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    last3DigitNRIC: req.body.last3DigitNRIC
  })

  try {
    const saveVisitor = await visitor.save();
    res.status(201).json({ saveVisitor, redirect: '/visitor' });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ visitor, errors });
  }
})

/**
 * @route   PUT /visitor/:id
 * @desc    This will accept PUT data and update visitor data to mongoDB
 */
router.put('/:id', async (req, res) => {
  // Retrieve update data from req body
  const { name, contactNumber, last3DigitNRIC } = req.body

  try {
    // Search for unit with id provided
    let visitor = await Visitor.findById(req.params.id)

    // Update unit with info from req.body
    visitor.name = name
    visitor.contactNumber = contactNumber
    visitor.last3DigitNRIC = last3DigitNRIC

    // Save updated unit
    const saveVisitor = await visitor.save()

    // Response back user with save data
    res.status(201).json({ saveVisitor, redirect: "/visitor" });
  } catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
})

/**
 * @route   DELETE /visitor/:id
 * @desc    This will delete visitor and all reference visitor logs from mongoDB
 */
router.delete('/:id', async (req, res) => {
  try {
    // Delete all visitor logs
    await VisitorLog.find({ visitor_id: req.params.id}).remove()

    // Delete visitor
    await Visitor.findByIdAndDelete(req.params.id)

    // Redirect to visitor page
    res.redirect('/visitor')
  } catch(err) {
    res.json({ err: 'Fail to delete' })
  }
})

module.exports = router