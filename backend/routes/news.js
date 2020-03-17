const router = require('express').Router();
// import {scrapeNews} from '../newsScrape';
const newsScraper = require('../newsScraper');

let News = require('../models/news.model');

router.route('/').post(async (req, res) =>{
    const start = Date.now();
    data = await newsScraper.scrapeNews(req.body.place);
    console.log('Took', Date.now() - start, 'ms');
    res.json({
        data: data
    });
});

module.exports = router;