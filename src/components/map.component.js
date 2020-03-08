import React from 'react';
import mapboxgl from 'mapbox-gl';
import {BrowserRouter as Router} from "react-router-dom";
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
            axios.get(URL + '/places')
                .then(response => {
                    let places = response.data.data.map(place => {
                        return {
                            type: 'Feature',
                            geometry:{
                                type: 'Point',
                                coordinates: [
                                    place.location.coordinates[0], 
                                    place.location.coordinates[1]
                                ]
                            },
                            properties:{
                                city: place.location.city
                            }
                        }
                    });
                    showMap(places);
                })
                .catch((error)=>{
                    console.log(error);
                })
        }

        async function showMap(places) {
            map.on('load', () => {
                map.addSource('places', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: places
                    }
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
                // map.addLayer({
                //     id: 'clusters',
                //     type: 'circle',
                //     source: 'places',
                //     filter: ['has', 'point_count'],
                //     paint: {
                //         // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                //         // with three steps to implement three types of circles:
                //         //   * Blue, 20px circles when point count is less than 100
                //         //   * Yellow, 30px circles when point count is between 100 and 750
                //         //   * Pink, 40px circles when point count is greater than or equal to 750
                //         'circle-color': [
                //             'step',
                //             ['get', 'point_count'],
                //             '#51bbd6',
                //             100,
                //             '#f1f075',
                //             750,
                //             '#f28cb1'
                //         ],
                //         'circle-radius': [
                //             'step',
                //             ['get', 'point_count'],
                //             20,
                //             100,
                //             30,
                //             750,
                //             40
                //         ]
                //     }
                // });
            });    

        };
        getPlaces();

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