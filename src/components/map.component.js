import React from 'react';
import mapboxgl from 'mapbox-gl';
import {BrowserRouter as Router} from "react-router-dom";
import Navbar from "./navbar.component";
import News from "./news.component";
import Accordion from "./accordion.component"
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
const geoCoder = require('../utils/geocoder');

const URL = 'http://localhost:8000'

//TODO: ADD toggle for mapbox

function createInstance() {
    var func = null;
    return {
      save: function(f) {
        func = f;
      },
      restore: function(context) {
        func && func(context);
      }
    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoicmxpbjI2NCIsImEiOiJjazdndzNlN2gwMDNnM2VwZWx0ZHdrZmwzIn0.65-lsnM81g2ZzfVLV6cgqQ';

export default class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -87.49,
            lat: 41.8,
            zoom: 2,
            city: ""
        };
    }

    componentDidMount() {
        var self = this;
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });
        map.addControl(new mapboxgl.NavigationControl());
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            fitBoundsOptions:{
                maxZoom: 8
            },
            trackUserLocation: false,
            showAccuracyCircle: true,
            showUserLocation: true
        })
        const geolocater = map.addControl(geolocate);
        geolocater.on('load', ()=>{
            geolocate._watchState = 'WAITING_ACTIVE';
            navigator.geolocation.getCurrentPosition(geolocate._updateMarker);
            // geolocate.trigger();
        })
        async function getPlaces(){
            axios.get(URL + '/places')
                .then(response => {
                    console.log(response.data);
                    let places = response.data.map(place => {
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
                                _id: place._id,
                                count: place.cases.cases,
                                recovered: place.cases.recovered
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
                const paint = {
                    'circle-color': [
                        'step',
                        ['get', 'count'],
                        '#51bbd6',
                        200,
                        '#9bf175',
                        1000,
                        '#f1f075',
                        5000,
                        '#f28c8c'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'count'],
                        20,
                        200,
                        25,
                        1000,
                        35,
                        5000,
                        40
                    ],
                    'circle-opacity':0.7
                }
                map.addSource('places', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: places
                    },
                    cluster: true,
                    clusterMaxZoom: 6,
                    clusterRadius: 35,
                    clusterProperties:{
                        count: ['+', ['get', 'count']]
                    }
                });
                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'places',
                    filter: ['has', 'point_count'],
                    paint: paint
                }); 
                const count = ['get', 'count'];
                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'places',
                    filter: ['has', 'count'],
                    layout: {
                        'text-field': ['case',  ['>=', count, 10000], 
                                                ['concat',['round',['/',count,1000]],'k'], 
                                            ['>=', count, 1000],
                                                ['concat',['/',['round',['/',count,100]],10],'k'],
                                            count
                                        ],
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });
                map.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'places',
                    filter: ['all', ['!has', 'point_count'], ['>','count',0]],
                    paint: paint
                });
                map.addLayer({
                    id: 'unclustered-count',
                    type: 'symbol',
                    source: 'places',
                    filter: ['!has', 'point_count'],
                    layout: {
                        // 'text-field': ['get','count'],
                        'text-field': ['case',  ['>=', count, 10000], 
                                                    ['concat',['round',['/',count,1000]],'k'], 
                                                ['>=', count, 1000],
                                                    ['concat',['/',['round',['/',count,100]],10],'k'],
                                                count
                                            ],
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        'icon-text-fit': 'both'
                    }
                });
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

        map.on('click', 'clusters', function(e) {
            var features = map.queryRenderedFeatures(e.point, {
                                    layers: ['clusters']
                                    });
            var clusterId = features[0].properties.cluster_id;
            var point_count = features[0].properties.point_count,
            // map.getSource('places').getClusterExpansionZoom(clusterId, function(err, zoom) {
            //     if (err) return;
            //     map.easeTo({
            //         center: features[0].geometry.coordinates,
            //         zoom: zoom
            //     });
            // });
            clusterSource = map.getSource('places');
            clusterSource.getClusterChildren(clusterId, function(err, aFeatures){
                console.log('getClusterChildren', err, aFeatures);
            });
            clusterSource.getClusterLeaves(clusterId, point_count, 0, function(err, aFeatures){
                console.log('getClusterLeaves', err, aFeatures);
            })
        });

        map.on('click','unclustered-point', function(e){
            var features = map.queryRenderedFeatures(e.point, {
                // layers: ['unclustered-point']    
                });
            console.log(features);
            // console.log(e.lngLat.lat)
            geoCoder.reverse({lat: e.lngLat.lat, lon: e.lngLat.lng})
                .then(function(res){
                    self.setState({
                        city: res[0].city,
                    });
                    self.forceUpdate();
                })
                .catch(function(err){
                    console.log(err);
                });
        });

        map.on('mouseenter', 'clusters', function() {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function() {
            map.getCanvas().style.cursor = '';
        });
    }
    render() {
        return (
            <div id='bigContainer'>
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</div>
                </div>
                <Router>
                    <Navbar/>
                </Router>
                <div ref={el => this.mapContainer = el} className='mapContainer' />
                {/* <div className='map-overlay' id='news'> */}
                    <Accordion className='news-overlay'>
                        <div label='Local News'>
                            <News location='userLocation' instance = {createInstance()}/>
                        </div>
                        <div label='News'>
                            <News location={this.state.city} instance = {createInstance()}/>
                        </div>
                    </Accordion>
                {/* </div> */}
            </div>
        )
    }
}