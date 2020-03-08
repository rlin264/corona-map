const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates:{
        type: [Number],
        required: true
    }
}, {
    timestamps: true,
})

const citySchema = new Schema({
    name: String,
    location:{
        type: pointSchema,
        required: true
    }
})

const City = mongoose.model('City', citySchema)

module.exports = City;