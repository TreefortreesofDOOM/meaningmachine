const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    //Meaning Machine Live
    endpointSecret: process.env.endpoint_secret,
    stripe_api_key: process.env.stripe_api_key,
    port: process.env.PORT,
	ha_api_key: process.env.HA_API_KEY,
    stripe_api_test_key: process.env.stripe_api_test_key,
    stripe_wh_secret: process.env.stripe_secret,
    ha_url: process.env.ha_url,
    ha_art_lock_wh_url: process.env.ha_art_lock_wh_url,
    cab_lock_id: process.env.cab_lock_id,
    ha_door_lock_wh_url: process.env.ha_door_lock_wh_url,
    door_lock_id: process.env.door_lock_id,
    stripe_wh2_sec: process.env.stripe_wh2_sec,
    servo_id: process.env.servo_id,
    servo_ha_url: process.env.servo_ha_url,
    stepper_id: process.env.stepper_id,
    stepper_ha_url: process.env.stepper_ha_url,
    stripe_secret: process.env.stripe_secret,
// Meaning Machine Test
    ENDPOINT_TEST_SECRET: process.env.ENDPOINT_TEST_SECRET,
};