const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    city: String,
    articles:{
        type: [String]
    }   
},  {
    timestamps: true,
});

const News = mongoose.model('News', newsSchema);

module.exports = News; 