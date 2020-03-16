const router = require('express').Router();
let City = require('../models/city.model');

router.route('/').get((req, res) =>{
    City.find()
        .then(cities => res.json(cities))
        .catch(err => res.status(400).json('Error:' + err));
});
 
router.route('/add').post((req, res) => {
    const _id = req.body.name;
    const name = req.body.name;
    const location = req.body.location;
    const newCity = new City({
        _id,
        name,
        location
    });

    newCity.save()
        .then(()=> res.json('City added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    City.findById(req.params.id)
        .then(city => res.json(city))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    City.findByIdAndDelete(req.params.id)
        .then(()=>res.json('City deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/update/:id').post((req, res) => {
    City.findById(req.params.id)
        .then(city => {
            city.name = req.body.name;
            city.location = req.body.location;

            city.save()
                .then(()=> res.json('City updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;