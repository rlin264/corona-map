import React from 'react';

export default class NewsWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
        var self = this
        function success(position){
            const data = {
                title:"",
                link:"",
                source:"",
                time:"",
                img:""
            };
            geoCoder.reverse({lat: position.coords.latitude, lon: position.coords.longitude})
                .then(function(res){
                    console.log(res[0].city);
                    axios.post(URL + '/news',
                        {place:res[0].city}
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
                })
                .catch(function(err){
                    console.log(err);
                });
        }
        function error(err){
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }
        
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
}