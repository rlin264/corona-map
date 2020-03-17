const axios = require('axios');

function getExternalCSV (region) {
    return `https://docs.google.com/spreadsheets/d/1Hz1BO2cGOba0a8WstvMBpjPquSCCWo3u48R7zatx_A0/gviz/tq?tqx=out:csv&sheet=${region}`;
};

function getExternalCSV (region) {
    return `https://docs.google.com/spreadsheets/d/1Hz1BO2cGOba0a8WstvMBpjPquSCCWo3u48R7zatx_A0/gviz/tq?tqx=out:csv&sheet=${region}`;
  };
  
  

axios({
    method: "get",
    url: utilities.getExternalCSV(region.sheetName),
    responseType: "stream"
  }).then(response => {
    response.data.pipe(
      fs.createWriteStream(utilities.getCSVPath(region.sheetName))
);