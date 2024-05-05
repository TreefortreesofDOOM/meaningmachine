const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

// General function to unlock items (doors, art, etc.)
async function unlockItem(itemType, unlockDetails) {
    try {
        const { deviceId, url } = unlockDetails;
        console.log(unlockDetails);
        console.log(`${deviceId, url}`);
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
    try {
        const doorUnlockDetails = {
        deviceId: `${config.door_lock_id}`,
        url: `${config.ha_door_lock_wh_url}`,
        }
        return await unlockItem('door', doorUnlockDetails);
    } catch (error) {
    console.log("error unlocking door:", error);
    }
};

// Specific function to unlock art
exports.unlocksArt = async () => {
    try {
        const artUnlockDetails = {
        deviceId: `${config.cab_lock_id}`,
        url: `${config.ha_art_lock_wh_url}`,
        }
        return await unlockItem('art', artUnlockDetails);
    } catch (error) {
    console.log("error unlocking door:", error);
    }
};
exports.unlocksWall = async () => {
    try {
        const artUnlockDetails = {
        deviceId: `${config.servo_id}`,
        url: `${config.servo_ha_url}`,
        }
        console.log("UnlocksWall function ran");
        return await unlockItem('art', artUnlockDetails); 
    } catch (error) {
    console.log("error unlocking wall art:", error);
    }
};
