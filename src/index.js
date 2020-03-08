import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import {BrowserRouter as Router, Route} from "react-router-dom";
import App from './App';
import Navbar from "./components/navbar.component";
import "bootstrap/dist/css/bootstrap.min.css";


mapboxgl.accessToken = 'pk.eyJ1IjoicmxpbjI2NCIsImEiOiJjazdndzNlN2gwMDNnM2VwZWx0ZHdrZmwzIn0.65-lsnM81g2ZzfVLV6cgqQ';

class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: -87.49,
            lat: 41.8,
            zoom: 8
        };
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

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

        geojson.features.forEach(function(marker) {
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                .addTo(map);
        });

        // map.addSouce('cases', {
        //     type: 'geojson'
        //     data:
        // })

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

ReactDOM.render(
    <div>
        <App/>
    </div>,
    document.getElementById('app')
);

// ReactDOM.render(
//     <App />,
//     document.getElementById('root')
// );