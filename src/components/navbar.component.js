import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Navbar extends Component{

    render(){
        return(
            <div>
                <nav className="navbar navbar-dark bg-dark navbar-expand-lg" style={{zIndex:1}}>
                    <Link to="/" className="navbar-brand">Coronavirus</Link>
                </nav>
            </div>
        )
    }
}