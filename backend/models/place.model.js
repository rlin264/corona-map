const mongoose = require('mongoose');
const geoCoder = require('../utils/geocoder');

const PlaceSchema = new mongoose.Schema({
    _id: String,
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    cases:{
        type: JSON,
        required: true
    }
});

// Before saving, convert address to geoCode
PlaceSchema.pre(['save'], async function(next) {
    const loc = await geoCoder.geocode(this.address);
    var ind = 0;
    if(this.address == 'Georgia'){
        // console.log(loc);
        ind = 1;
    }
    this.location = {
        type: 'Point',
        coordinates: [loc[ind].longitude, loc[ind].latitude],
        formattedAddress: loc[ind].formattedAddress
    };

    // Do not save address
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Place', PlaceSchema);