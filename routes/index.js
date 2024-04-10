const express = require('express');
const { unlockDoorHandler, lockStatusHandler } = require('../services/lockService');
const { handleStripeWebhook } = require('../services/stripeService');
const { unlocksArtHandler } = require('../services/artUnlockService'); // Implement similarly to doorUnlockService

const router = express.Router();

// HA webhook routes
router.post('/unlock-door', unlockDoorHandler);
router.post('/unlock-art', unlocksArtHandler)
router.get('/lock-status', lockStatusHandler);

// Stripe webhook route
router.post('/webhook', handleStripeWebhook);

module.exports = router;
