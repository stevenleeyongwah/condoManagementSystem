const mongoose = require('mongoose')

const visitCountSchema = new mongoose.Schema({
    // reference to block unit of the condo
    blockUnitNumber: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    // Keep track of number of visitors in the condo
    count: {
        type: Number,
        required: true,
    },
})

module.exports = mongoose.model('VisitCount', visitCountSchema)