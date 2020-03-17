const axios = require('axios');
const config = { headers: {'Content-Type': 'application/json'} };

const URL = 'http://localhost:8000'

axios.post(URL + '/news',
    {place:"Toronto"}, config
)
.then(response => {
    console.log(response.data.data);
})
.catch((error)=>{
    console.log(error);
})