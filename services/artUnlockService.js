const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

exports.unlocksArt = async () => {
    try {
        // Assuming the unlock mechanism is triggered via a webhook or API call
        const response = await axios.post(config.ha_wh_url, {
            device_id: config.art_lock_id, // The unique identifier for the art lock device
            action: 'unlock' // The action you want to perform. This is hypothetical and depends on your actual API.
        });

        // Log the successful unlock action
        if (response.status === 200) {
            logger.info('Art unlocked successfully.', { response: response.data });
            return { success: true, message: 'Art unlocked successfully.' };
        } else {
            // Log any unsuccessful attempts with the response status
            logger.error('Failed to unlock art.', { statusCode: response.status });
            return { success: false, message: 'Failed to unlock art.' };
        }
    } catch (error) {
        // Log the error with the error message
        logger.error('Error unlocking art:', { error: error.message });
        throw new Error(`Error unlocking art: ${error.message}`);
    }
};
