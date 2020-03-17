const NodeGeoCoder = require('node-geocoder');

const options = {
    // provider: process.env.GEOCODER_PROVIDER,
    provider: 'openstreetmap',
    // httpAdapter: 'https',
    // apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;