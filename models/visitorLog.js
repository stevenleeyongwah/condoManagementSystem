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
        validate: [/^$|^[A-Z]-\d\d-\d\d$/, 'Invalid format of block & unit number'],
    },
    visitPurpose: {
        type: String,
    },
    // Name of the condo owner
    entryDateTime: {
        type: Date,
        required: true
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