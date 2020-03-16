const express = require('express');
const Place = require('../models/place.model');
// const {getPlaces, addPlace} = require('../controllers/places');

const router = express.Router();

router.route('/').post((req, res) => {
    const _id = req.body.address;
    const address = req.body.address;
    const cases = req.body.cases;
    const filter = {_id: _id};
    const newPlace = new Place({
        _id,
        address,
        cases
    });
    const update = {
        _id: _id,
        address: address,
        cases: cases,
    }
    Place.findOneAndUpdate(filter, update, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send('Succesfully saved.');
    });
    // var upsertData = newPlace.toObject();
    // delete upsertData._id;
    // newPlace.update({_id:newPlace._id}, upsertData,  {upsert: true}, function(err, doc){
    //     if(err) throw err;
    //     console.log(doc);
    // });
    // newPlace.save()
    //     .then(()=> res.json('Place added'))
    //     .catch(err => {
    //         res.status(400).json('Error2: ' + err)
    //     });
});

router.route('/').get((req, res) =>{
    Place.find()
        .then(places => res.json(places))
        .catch(err => res.status(400).json('Error3:' + err));
});

module.exports = router;