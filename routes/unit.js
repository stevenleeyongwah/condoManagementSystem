const express = require('express')
const router = express.Router()
const Unit = require('../models/unit')

// handle errors
const handleErrors = (err) => {
    let errors = { blockUnitNumber: '', name: '', contactNumber: '' };

    // duplicate unit number error
    if (err.code === 11000) {
      console.log(err)
      errors.blockUnitNumber = `UnitNumber ${err.keyValue.blockUnitNumber} is already registered`;
      return errors;
    }

    // validation errors
    if (err.message.includes('Invalid format of block & unit number') ||
        err.message.includes('Invalid format of owner name') || 
        err.message.includes('Invalid format of contact number')
    ) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// All Units Route
router.get('/', async (req, res) => {
  try {
    const units = await Unit.find().sort({ createdAt: -1 }).exec()
    res.render('unit/index', { units })
  } catch {
    res.redirect('/')
  }
})

// New Unit Route
router.get('/new', (req, res) => {
  res.render('unit/new', { unit: new Unit(), action: '/unit' })
})

// Create Unit Route
router.post('/', async (req, res) => {
  const unit = new Unit({
    blockUnitNumber: req.body.blockUnitNumber,
    name: req.body.name,
    contactNumber: req.body.contactNumber
  })

  try {
    const saveUnit = await unit.save();
    res.status(201).json({ saveUnit });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ unit: unit, errors });
  }
})

router.get('/:id', async (req, res) => {
  const unit = await Unit.findOne({ _id: req.params.id })

  if (unit == null) res.redirect('/')
  res.render('unit/detail', { unit })
})

router.get('/edit/:id', async (req, res) => {
  const unit = await Unit.findById(req.params.id)
  res.render('unit/edit', { unit: unit, action: `/unit/${unit.id}?_method=PUT` })
})

router.put('/:id', async (req, res) => {
  // Retrieve update data from req body
  const { blockUnitNumber, name, contactNumber } = req.body

  try {
    // Search for unit with id provided
    let unit = await Unit.findById(req.params.id)

    // Update unit with info from req.body
    unit.blockUnitNumber = blockUnitNumber
    unit.name = name
    unit.contactNumber = contactNumber

    // Save updated unit
    const saveUnit = await unit.save()

    // Response back user with save data
    res.status(201).json({ saveUnit });
  } catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ unit: unit, errors });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Unit.findByIdAndDelete(req.params.id)
    res.redirect('/unit')
  } catch(err) {
    res.json({ err: 'Fail to delete' })
  }
})

module.exports = router