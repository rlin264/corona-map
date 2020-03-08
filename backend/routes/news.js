const router = require('express').Router();
let News = require('../models/news.model');

router.route('/').get((req, res) =>{
   News.find()
    .then(news => res.json(news))
    .catch(err => res.status(400).json('Error:' + err));
});
 
router.route('/add').post((req, res) => {
    const city = req.body.city;

    const newCity = new News({city});

    newCity.save()
        .then(()=> res.json('News added'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;