const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
    // blockNumber has to be [ X(block(A-Z))-XX(floor(00-99))-XX(unit(00-99)) Example: A-02-03 ]
    blockUnitNumber: {
        type: String,
        required: [true, 'Please enter block & unit number'],
        validate: [/^[A-Z]-\d\d-\d\d$/, 'Invalid format of block & unit number'],
        unique: true,
    },
    // Name of the condo owner
    name: {
        type: String,
        required: [true, 'Please enter name of condo owner'],
        validate: [/^[a-zA-Z\s]{1,40}$/, 'Invalid format of owner name'],
    },
    // Contact number of owner
    contactNumber: {
        type: String,
        validate: [/^\d{8}$/, 'Invalid format of contact number'],
    },
    // Date of unit is created
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Unit', unitSchema)