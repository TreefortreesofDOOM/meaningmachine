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

// Function to unlock the door
exports.unlocksDoor = async () => {

    const deviceId = config.door_lock_id || process.env.DOOR_LOCK_ID;
    const url = process.env.HA_DOOR_LOCK_WH_URL;  

    try {
        const doorUnlockDetails = {
        deviceId,
        url,
        }
        return await unlockItem('door', doorUnlockDetails);
    } catch (error) {
    console.log("error unlocking door:", error);
    }
};

//  Function to unlock art
exports.unlocksArt = async () => {

    const deviceId = config.cab_lock_id || process.env.CAB_LOCK_ID;
    const url = config.ha_art_lock_wh_url || process.env.HA_ART_LOCK_WH_URL;

    try {
        const artUnlockDetails = { deviceId, url };
        return await unlockItem('art', artUnlockDetails);
    } catch (error) {
        console.log("error unlocking door:", error);
    }
};
// Function to unlock wall art
exports.unlocksWall = async () => {
    
    const deviceId = config.servo_id_id || process.env.SERVO_ID;
    const url = process.env.SERVO_HA_URL;
    
    try {
        const artUnlockDetails = { deviceId, url }
        console.log("UnlocksWall function ran");
        return await unlockItem('dragon', artUnlockDetails); 
    } catch (error) {
    console.log("error unlocking wall art:", error);
    }
};
