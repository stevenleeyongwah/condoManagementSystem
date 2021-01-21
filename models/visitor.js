const mongoose = require('mongoose')
const VisitorLog = require('./visitorLog')

const visitorSchema = new mongoose.Schema({
    // blockNumber has to be [ X(block(A-Z))-XX(floor(00-99))-XX(unit(00-99)) Example: A-02-03 ]
    name: {
        type: String,
        required: [true, 'Please enter name of visitor'],
        validate: [/^[a-zA-Z\s]{1,40}$/, 'Invalid format of visitor name'],
        unique: true,
    },
    // Name of the condo owner
    contactNumber: {
        type: String,
        required: [true, 'Please enter contact number of visitor'],
        validate: [/^\d{8}$/, 'Invalid format of contact number'],
    },
    last3DigitNRIC: {
        type: String,
        required: true,
        validate: [/^\d{3}$/, 'Invalid format of NRIC'],
    },
    // Date of unit is created
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// visitorSchema.pre('deleteMany', function(next) {
//     console.log("remove all")
//     // Remove all the assignment docs that reference the removed person.
//     this.model('VisitorLog').remove({ visitor_id: this._id }, next);
// });

// visitorSchema.pre('deleteOne', function(next) {
//     console.log("Pre delete")
//     const visitorId = this.getQuery()["_id"];
//     console.log("visitorId: ", visitorId)
//     // mongoose.model('VisitorLog').deleteOne({ person: person._id }, next);
// });

module.exports = mongoose.model('Visitor', visitorSchema)