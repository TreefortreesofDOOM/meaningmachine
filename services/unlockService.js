const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

// General function to unlock items (doors, art, etc.)
async function unlockItem(itemType, unlockDetails) {
    try {
        const { deviceId, url } = unlockDetails;

        // Sending a POST request to the webhook endpoint
        const response = await axios.post(url, { device_id: deviceId });
        logger.info(`Response from unlocking ${itemType}:`, response.data);

        // Check the response
        if (response.status === 200) {
            logger.info(`Successfully unlocked ${itemType}.`);
            return { success: true, message: `Successfully unlocked ${itemType}.` };
        } else {
            throw new Error(`Failed to unlock ${itemType}. Webhook did not succeed.`);
        }
    } catch (error) {
        logger.error(`Error unlocking ${itemType}:`, error.message);
        throw error; // Rethrowing the error for the caller to handle
    }
}

// Specific function to unlock the door
exports.unlocksDoor = async () => {
    const doorUnlockDetails = {
        deviceId: config.cabLockId, // Assuming the cabinet lock ID is used for the door in this context
        url: config.doorUnlockUrl // This should be added to your config, similar to how ha_wh_url is defined
    };
    return await unlockItem('door', doorUnlockDetails);
};

// Specific function to unlock art
exports.unlocksArt = async () => {
    const artUnlockDetails = {
        deviceId: config.artLockId, // Assuming you have an art lock ID defined in your config
        url: config.artUnlockUrl // This should be added to your config
    };
    return await unlockItem('art', artUnlockDetails);
};
