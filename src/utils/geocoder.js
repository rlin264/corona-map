const NodeGeoCoder = require('node-geocoder');

const options = {
    provider: 'openstreetmap',
    // httpAdapter: 'https',
    // apiKey: '9okpFG6Ap1AAOkH5ziwaV8DIDQQPXTxd',
    formatter: null
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;