const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const visitorLogSchema = new Schema({
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
    entryDateTime: {
        type: String,
        required: true
    },
    exitDateTime: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('VisitorLog', visitorLogSchema)