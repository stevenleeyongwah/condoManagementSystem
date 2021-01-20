const express = require('express')
const router = express.Router()
const Owner = require('../models/owner')

// handle errors
const handleErrors = (err) => {
    let errors = { name: '', contactNumber: '' };

    // duplicate name error
    if (err.code === 11000) {
        console.log(err)
        errors.name = `Name ${err.keyValue.name} is already registered`;
        return errors;
    }

    // validation errors
    if (err.message.includes('Invalid format of owner name') || 
        err.message.includes('Invalid format of contact number')
    ) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// All Authors Route
router.get('/', async (req, res) => {

})

// New Author Route
router.get('/new', (req, res) => {
    
})

// Create Owner Route
router.post('/', async (req, res) => {
    const { name, contactNumber } = req.body

    // If any of the fields are empty, return message to user (Ask them to fill in all fields)
    if ( !name || !contactNumber ) {
        res.status(404).json({ errors: "Please fill in all the fields" })
    }

    try {
        const owner = await Owner.create({ name, contactNumber });

        res.status(201).json({ msg: "Successfully" });
    } catch (err) {
        const errors = handleErrors(err);

        res.status(400).json({ errors });
    }
})

router.get('/:id', async (req, res) => {

})

router.get('/:id/edit', async (req, res) => {
  
})

router.put('/:id', async (req, res) => {
  
})

router.delete('/:id', async (req, res) => {
  
})

module.exports = router