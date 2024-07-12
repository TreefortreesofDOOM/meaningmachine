const express = require('express');
const { unlocksDoor, unlocksArt } = require('../services/unlockService');
const { handleStripeWebhook } = require('../services/stripeService');
const { getArtLockStatus, getDoorLockStatus } = require('../services/lockStatusService'); // Importing lock service functions
const router = express.Router();
router.use(express.json());

router.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
  });

router.post('/webhooks', express.raw({type: 'application/json'}), handleStripeWebhook);

// Route to unlock a door
router.post('/unlock-door', async (req, res) => {
    try {
        const result = await unlocksDoor();
        res.json({ success: true, message: 'Door unlocked successfully', details: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to unlock art
router.post('/unlock-art', async (req, res) => {
    try {
        const result = await unlocksArt();
        res.json({ success: true, message: 'Art unlocked successfully', details: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to check the lock status
router.get('/lock-status/:type', async (req, res) => {
    const { type } = req.params;
    try {
        let status;
        if (type === 'door') {
            status = await getDoorLockStatus();
        } else if (type === 'art') {
            status = await getArtLockStatus();
        } else if (type === 'wall') {
            status = await getWallLockStatus();
        } else {
            return res.status(400).json({ success: false, message: 'Invalid lock type specified' });
        }
        res.json({ success: true, message: `The ${type} is currently ${status}.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
