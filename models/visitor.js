const mongoose = require('mongoose')
const VisitorLog = require('./visitorLog')

const visitorSchema = new mongoose.Schema({
    // blockNumber has to be [ X(block(A-Z))-XX(floor(00-99))-XX(unit(00-99)) Example: A-02-03 ]
    name: {
        type: String,
        required: true,
        validate: [/^[a-zA-Z\s]{1,40}$/, 'Invalid format of visitor name'],
    },
    // Name of the condo owner
    contactNumber: {
        type: String,
        required: true,
        validate: [/^\d{8}$/, 'Invalid format of contact number'],
        unique: true,
    },
    // Last 3 digit of visitor NRIC
    last3DigitNRIC: {
        type: String,
        required: true,
        validate: [/^\d{3}$/, 'Invalid format of NRIC'],
        unique: true,
    },
    // Date of visitor is created
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Visitor', visitorSchema)