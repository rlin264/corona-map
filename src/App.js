import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// import Navbar from "./components/navbar.component";
// import CitiesList from "./components/cities-list.component"
import Map from "./components/map.component";

function App() {
    return(
        <Router>
            <Map/>
        </Router>
    )
}

export default App