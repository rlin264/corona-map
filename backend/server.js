const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


console.log("STARTING SERVER");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB database connection established successfully");
});
const newsRouter = require('./routes/news');
const cityRouter = require('./routes/cities');
const placeRouter = require('./routes/places');
app.use('/news', newsRouter);
app.use('/cities', cityRouter);
app.use('/places', placeRouter);

app.use(express.static(path.join(__dirname, '../build')));
// app.use(express.static(path.join(__dirname, '../public')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../build/index.html"));
});

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, ()=> {
    console.log(`Server is running on port: ${port}`);
});