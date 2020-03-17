const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: String,
    link: String,
    source: String,
    time: String,
    img: String,
},  {
    timestamps: true,
});

const News = mongoose.model('News', newsSchema);

module.exports = News; 