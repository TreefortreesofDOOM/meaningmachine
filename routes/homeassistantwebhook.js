const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const lockStatus = require('./lockservice');
const { art_lock_id } = require('../config');

app.use(bodyParser.raw({ type: 'application/json' }));

// Function to unlock the door using the Seam API
async function unlocksArt() {
    try {
        const artLockWebhookUrl = 'https://hooks.nabu.casa/gAAAAABmEBUNBZjOk1-qJciQMQ876RhJh9UfHZv9VyjsTgv2_aiiZ5HLMTzKB2UWkRAGo9uclm7G4MWN000YtIXPFFRnwFLG4B3kTge5LuifSWGcqmC_LZasb7r2D7HXyFfG0vTY3LlQSNPTyKEmFvGoESLkyvlan_GLmF--UqsW1XCvcVvqjbg=';

        // Sending a POST request to the home assistant webhook endpoint
        const response = await axios.post(artLockWebhookUrl, { device_id: art_lock_id });
        console.log(response);

        // Check the response
        if (response.status === 200) {
            console.log('Webhook received by nabu.');
        } else {
            throw new Error('Webhook Failed to deliver correctly. Lock unchanged');
        }
        lockStatus();
    }
    catch (error) {
        console.error('Error checking status:', error.message);
    }
};

module.exports = unlocksArt;