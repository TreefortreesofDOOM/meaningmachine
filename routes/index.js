const express = require('express');
const { unlocksDoor, unlocksArt } = require('../services/unlockService');
const { handleStripeWebhook } = require('../services/stripeService');
const { getArtLockStatus, getDoorLockStatus } = require('../services/lockService'); // Importing lock service functions
const router = express.Router();

// Route to handle Stripe webhooks
router.post('/stripe-webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = await handleStripeWebhook(req.body, sig);
        res.json({ received: true, message: 'Stripe webhook processed successfully', event });
    } catch (error) {
        res.status(400).json({ received: false, message: error.message });
    }
});

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
        } else {
            return res.status(400).json({ success: false, message: 'Invalid lock type specified' });
        }

        res.json({ success: true, message: `The ${type} is currently ${status}.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
