const express = require('express');
const {getPlaces, addPlace} = require('../controllers/places');

const router = express.Router();

router
    .route('/')
    .get(getPlaces)
    .post(addPlace);

// TODO: add router update functionality
module.exports = router;