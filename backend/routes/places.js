const express = require('express');
const Place = require('../models/place.model');
// const {getPlaces, addPlace} = require('../controllers/places');
const geoCoder = require('../utils/geocoder')

const router = express.Router();

router.route('/').post(async(req, res) => {
    const _id = req.body.address;
    const address = req.body.address;
    const cases = req.body.cases;
    const filter = {_id: _id};
    // const loc = await geoCoder.geocode(address);
    // const location = {
    //     type: 'Point',
    //     coordinates: [loc[0].longitude, loc[0].latitude],
    //     formattedAddress: loc[0].formattedAddress
    // };

    Place.count({_id:_id}, function(err, count){
        if(count > 0){
            const update = {
                _id: _id,
                address: address,
                cases: cases,
            }
            Place.findOneAndUpdate(filter, update, function(err, doc) {
                if (err){ 
                    return res.send(500, {error: err});
                }
                return res.send('Succesfully saved.');
            });
        }
        else{
            const newPlace = new Place({
                _id,
                address,
                cases
            });

            newPlace.save()
            .then(()=> res.json('City added'))
            .catch(err => {
                console.log('place')
                console.log(newPlace);
                res.status(400).json('Error: ' + err)
            });
        }
    })
});

router.route('/').get((req, res) =>{
    Place.find()
        .then(places => res.json(places))
        .catch(err => res.status(400).json('Error3:' + err));
});

router.route('/:id').delete((req, res) => {
    Place.findByIdAndDelete(req.params.id)
        .then(()=>res.json('Places deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;