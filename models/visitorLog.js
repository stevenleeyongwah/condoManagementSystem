const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const visitorLogSchema = new Schema({
    // blockNumber has to be [ X(block(A-Z))-XX(floor(00-99))-XX(unit(00-99)) Example: A-02-03 ]
    visitor_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Visitor' 
    },
    blockUnitNumber: { 
        type: String,
        required: [true, 'Please enter block & unit number'],
        validate: [/^[A-Z]-\d\d-\d\d$/, 'Invalid format of block & unit number'],
    },
    // Name of the condo owner
    entryDateTime: {
        type: Date
    },
    // Contact number of owner
    exitDateTime: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('VisitorLog', visitorLogSchema)