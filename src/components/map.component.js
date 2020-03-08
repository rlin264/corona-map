import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Navbar from "./navbar.component";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

const URL = 'http://localhost:5000'


mapboxgl.accessToken = 'pk.eyJ1IjoicmxpbjI2NCIsImEiOiJjazdndzNlN2gwMDNnM2VwZWx0ZHdrZmwzIn0.65-lsnM81g2ZzfVLV6cgqQ';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -87.49,
            lat: 41.8,
            zoom: 2
        };
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        async function getPlaces(){
            // const res = await fetch('/places');
            // console.log("fectched");
            // const data = await res.json();
            // console.log("ASDA");
            axios.get(URL + '/places')
                .then(response => {
                    console.log(response.data);
                    let places = response.data.map(place => (
                        {
                            type: 'Feature',
                            geometry:{
                                type: 'Point',
                                coordinates: [place.location.coordinates[0], place.location.coordinates[1]]
                            },
                            properties:{
                                city: place.location.city
                            }
                        }
                    ));
                    
                    return places;
                })
                .catch((error)=>{
                    console.log(error);
                })
        }

        async function showMap() {
            let places = await getPlaces();
        
            map.on('load', () => {
        
                map.addSource('places', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: places
                    }
                    // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
                });
        
                map.addLayer({
                    id: 'points',
                    type: 'symbol',
                    minzoom: 0,
                    source: 'places',
                    layout: {
                        'icon-image': 'marker-15',
                        'icon-allow-overlap': true,
                        'text-allow-overlap': true,
                        'icon-size': 2,
                        'text-field': '{city}',
                        'text-offset': [0, 0.9],
                        'text-anchor': 'top'
                    },
                    paint: {
                        "text-color": "#00d1b2",
                    },
                });
                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'places',
                    filter: ['has', 'point_count'],
                    paint: {
                        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                });
            });    

        };

        showMap();
        
        var geojson = {
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Lincoln Park",
                        "description": "A northside park that is home to the Lincoln Park Zoo"
                    },
                    "geometry": {
                        "coordinates": [-87.637596, 41.940403],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Burnham Park",
                        "description": "A lakefront park on Chicago's south side"
                    },
                    "geometry": {
                        "coordinates": [-87.603735, 41.829985],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Millennium Park",
                        "description": "A downtown park known for its art installations and unique architecture"
                    },
                    "geometry": {
                        "coordinates": [-87.622554, 41.882534],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Grant Park",
                        "description": "A downtown park that is the site of many of Chicago's favorite festivals and events"
                    },
                    "geometry": {
                        "coordinates": [-87.619185, 41.876367],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Humboldt Park",
                        "description": "A large park on Chicago's northwest side"
                    },
                    "geometry": {
                        "coordinates": [-87.70199, 41.905423],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Douglas Park",
                        "description": "A large park near in Chicago's North Lawndale neighborhood"
                    },
                    "geometry": {
                        "coordinates": [-87.699329, 41.860092],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Calumet Park",
                        "description": "A park on the Illinois-Indiana border featuring a historic fieldhouse"
                    },
                    "geometry": {
                        "coordinates": [-87.530221, 41.715515],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Jackson Park",
                        "description": "A lakeside park that was the site of the 1893 World's Fair"
                    },
                    "geometry": {
                        "coordinates": [-87.580389, 41.783185],
                        "type": "Point"
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "title": "Columbus Park",
                        "description": "A large park in Chicago's Austin neighborhood"
                    },
                    "geometry": {
                        "coordinates": [-87.769775, 41.873683],
                        "type": "Point"
                    }
                }
            ],
            "type": "FeatureCollection"
        };

        // geojson.features.forEach(function(marker) {
        //     // create a HTML element for each feature
        //     var el = document.createElement('div');
        //     el.className = 'marker';

        //     // make a marker for each feature and add to the map
        //     new mapboxgl.Marker(el)
        //         .setLngLat(marker.geometry.coordinates)
        //         .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        //             .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
        //         .addTo(map);
        // });

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });

    }
    render() {
        return (
            <div style={{height: '100vh'}}>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <Router>
                    <Navbar/>
                </Router>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
            </div>
        )
    }
}