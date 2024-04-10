const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const lockStatus = require('./lockservice');
const { cab_lock_id } = require('../config');

app.use(bodyParser.raw({ type: 'application/json' }));

// Function to unlock the door using the Nabu Casa webhook
async function unlocksDoor() {
    try {
        const deviceId = '-2QCI582y04lktUV2XjPLEdwf'; // Replace with your actual device ID
        const url = 'https://hooks.nabu.casa/gAAAAABmFaD2guk8sJKPH3yMAGb7VeIqvGkxa30ajTlZX3fBuYZtx5MZpfGXd_maKoZ5piTP7tZD-5J7LANEF6eMaacC0BNzgs4QxXdy8hF8acvPqSXmtPVwDMEsiTENwNztnEnrzxnvvmqb30uk3Rk-pjM9t0vV54sVakjgAcQJtvLMA_ICzuQ=';

        // Sending a POST request to the home assistant webhook endpoint
        const response = await axios.post(url, { device_id: cab_lock_id });
        console.log(response);

        // Check the response
        if (response.status === 200) {
            console.log('Webhook received by nabu.');
        } else {
            throw new Error('Webhook Failed to deliver correctly. Lock unchanged');
        }
    }
    catch (error) {
        console.error('Error checking status:', error.message);
    }
};

unlocksDoor();

app.listen(4242, () => {
  console.log('Server is listening on port 4242');
});
