import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";


mapboxgl.accessToken = 'pk.eyJ1IjoicmxpbjI2NCIsImEiOiJjazdndzNlN2gwMDNnM2VwZWx0ZHdrZmwzIn0.65-lsnM81g2ZzfVLV6cgqQ';

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