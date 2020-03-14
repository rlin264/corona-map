import React from 'react';
const geoCoder = require('../utils/geocoder');
const openGeocoder = require('node-open-geocoder')
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('fb7f73ec11c34ee08dae0ae0c5ed6a85');

newsapi.v2.everything({
    qInTitle: 'toronto coronavirus',
    language: 'en',
    sortBy: 'relevancy',
  }).then(response => {
    console.log(response);
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  });

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// openGeocoder()
//     .reverse(43.665271, -79.366428)
//     .end((err,res)=>{console.log(res);});

// geoCoder.reverse({lat:45.767, lon:4.833}, function(err, res) {
//     console.log(res);
// });


async function success(position: Position){
    console.log(position);
    // const loc = await geoCoder.geocode("china");
        geoCoder.reverse({lat: position.coords.latitude, lon: position.coords.longitude})
            .then(function(res){
                console.log(res[0].city);
            })
            .catch(function(err){
                console.log(err);
            });
}
function error(err){
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

export default class News extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
    
    render(){
        return(
            <p>TESTING</p>
        );
    }
    
}