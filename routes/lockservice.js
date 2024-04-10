const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.raw({ type: 'application/json' }));


async function lockStatus() {
    try {
          //const entityId = ('lock.front_door');
          const url = (`http://homeassistant.local:8123/api/states/lock.front_door`);
          const headers = {
            'Authorization': `Bearer ${ha_api_key}`,
            'Content-type': 'application/json'
        };
  
        const response = await axios.get(url, { headers: headers });
        console.log(response.data);

        if (response.data.state === 'unlocked') {
          console.log('unlocked');
        } else {
          console.log('locked');
          }
      
    } catch (error) {
        console.error('Error checking status:', error.message);
      }
};

module.exports = lockStatus;



exports.getArtLockStatus = async () => {
	try{
	const response = await axios.get(`http://homeassistant.local:8123/api/states/lock.front_door`, { 
        headers: {
			'Authorization': `Bearer ${ha_api_key}`,
			'Content-type': 'application/json',
			}
      	});
      	console.log(response.data);

      	if (response.data.state === 'unlocked') {
        	console.log('unlocked');
      	} else {
        	console.log('locked');
    	}
    	return response.data.state;
	} catch (error) {
		console.error('Error checking status:', error.message);
		return error.message;
	}
};
