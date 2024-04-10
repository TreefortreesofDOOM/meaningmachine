const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	port: process.env.PORT,
	ha_api_key: process.env.HA_API_KEY,
    stripe_api_test_key: process.env.stripe_api_test_key,
    stripe_wh_secret: process.env.stripe_secret,
    ha_url: process.env.ha_url,
    ha_art_lock_wh_url: process.env.ha_art_lock_wh_url,
    ha_door_lock_wh_url: process.env.ha_door_lock_wh_url,
    cab_lock_id: process.env.cab_lock_id,
    art_lock_id: process.env.art_lock_id,
};