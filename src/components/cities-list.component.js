import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const URL = 'http://localhost:5000'

const City = props => (
    <tr>
        <td>{props.city.name}</td>
        <td>{props.city.location.coordinates[0]}, {props.city.location.coordinates[1]}</td>
    </tr>
)

export default class CitiesList extends Component{
    constructor(props){
        super(props);

        this.state = {cities: []};
    }

    componentDidMount(){
        axios.get(URL + '/cities/')
            .then(response => {
                this.setState({cities: response.data});
            })
            .catch((error)=>{
                console.log(error);
            })
    }
    
    cityList(){
        return this.state.cities.map(currentcity =>{
            return <City city={currentcity} key={currentcity._id} />;
        });
    }

    render(){
        return(
            <div>
                <h3>Cities List</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>City</th>
                            <th>Location</th>
                        </tr>   
                    </thead>
                    <tbody>
                        { this.cityList() }
                    </tbody>
                </table>
            </div>
        )
    }
}