import React from 'react';
import axios from 'axios';
const geoCoder = require('../utils/geocoder');

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

export default class News extends React.Component {
    constructor(props) {
        super(props);
        var self = this
        this.state = {
            data: null,
            prevLocation: null,
        };
        function success(position){
            geoCoder.reverse({lat: position.coords.latitude, lon: position.coords.longitude})
                .then(function(res){
                    console.log(res[0].city);
                    axios.post('/news',
                        {place:res[0].city}
                    )
                    .then(response => {
                        console.log(response.data)
                        self.setState({
                            data: response.data,
                            prevLocation: res[0].city
                        })
                        // self.setState(self.state);
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
                })
                .catch(function(err){
                    console.log(err);
                });
        }
        function error(err){
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
        if(this.props.location==='userLocation'){
            console.log("userLoc")
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
        else{
            if(this.props.location !== this.state.prevLocation){
                this.setState({data: null});
                this.setState(this.state);
                axios.post('/news',
                        {place: this.props.location}
                    )
                    .then(response => {
                        console.log(response.data)
                        self.setState({
                            data: response.data,
                        })
                        self.setState(self.state);
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
            }
            this.state.prevLocation = this.props.location
        }
    }
    
    componentWillMount() {
        this.props.instance.restore(this)
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        var state = this.state
        this.props.instance.save(function(ctx){
          ctx.setState(state)
        })
    }
    componentDidUpdate(){
        // var self = this
        if(this.props.location !== 'userLocation' && this.props.location !== this.state.prevLocation){
            this.setState({data: null}, ()=>{
                console.log(this.props.location);
                axios.post('/news',
                                {place: this.props.location}
                            )
                            .then(response => {
                                // console.log(response.data)
                                this.setState({
                                    data: response.data,
                                })
                                this.setState(this.state);
                            })
                            .catch((error)=>{
                                console.log(error);
                            })
            })
        }
    }
    
    renderRow(row){
        return(
            <div key={row.title}>
                <p>
                    {row.title}
                </p>
            </div>
        );
    }

    render(){
        return(
            <div>
                {this.state.data === null ? 
                    <div className="loader"></div>
                :
                    <div>
                            {this.state.data.data.map(this.renderRow)}
                    </div>
                }
            </div>

        );
    }
    
}