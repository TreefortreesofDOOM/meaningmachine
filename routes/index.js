const express = require('express');
const { unlocksDoor, unlocksArt } = require('../services/unlockService');
const { handleStripeWebhook } = require('../services/stripeService');
const { getArtLockStatus, getDoorLockStatus } = require('../services/lockService'); // Importing lock service functions
const router = express.Router();

// router.post('/unlock-door', unlockDoorHandler);
// router.get('/lock-status', lockStatusHandler);
// router.post('/webhook', handleStripeWebhook);
// router.post('/unlock-art', unlocksArtHandler);
// Route to handle Stripe webhooks
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);
// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.

/*
const stripe = require('stripe')('sk_test_...');
const express = require('express');
const app = express();


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_b4c175456b43a3b3dee8baf42d840c7570e915aba4a1c32d1e59e1693b6e0391";

router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  
  if (event.type === 'payment_intent.succeeded') {
    const metadata = event.data.object.metadata;
    console.log('payment intent succeded log');
    if (metadata.art === 'exists') {
        logger.info('Unlocking art...');
        await unlocksArt();
    } else if (metadata.entry === 'frontdoor') {
        logger.info('Unlocking front door...');
        await unlocksDoor();
    }
    } else {
        logger.info('Unhandled event type');
    }
        
    res.json({ received: true });
} catch (err) {
    logger.error(`Webhook Error A: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
};*/
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
