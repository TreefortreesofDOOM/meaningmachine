const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

// Generalized function to get the current status of any lock
exports.getLockStatus = async (lockId) => {
    try {
        const url = `${config.ha_url}/api/states/${lockId}`;
        const headers = {
            'Authorization': `Bearer ${config.ha_api_key}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.get(url, { headers });
        logger.info(`Lock status for ${lockId}: ${response.data.state}`);

        if (response.data.state === 'unlocked') {
            logger.info(`${lockId} is unlocked.`);
        } else {
            logger.info(`${lockId} is locked.`);
        }
        return response.data.state; // Returning the state ('unlocked' or 'locked')
    } catch (error) {
        logger.error(`Error checking lock status for ${lockId}: ${error.message}`);
        throw error; // Rethrowing the error for the caller to handle
    }
};
// Function for getting the art lock status
exports.getArtLockStatus = async () => {
    const LockId = 'lock.Meaning_Machine';
    return await this.getLockStatus(LockId);
};
// Function to get the door lock status
exports.getDoorLockStatus = async () => {
    const LockId = 'lock.front_door';
    return await this.getLockStatus(LockId);
};
// Function to get the Wall lock Status
// todo: figure out how to get the state of the wall lock in home assistant. 
exports.getWallLockStatus = async () => {
    const LockId = 'number.servoart_servo_control';
    return await this.getLockStatus(LockId);
};
