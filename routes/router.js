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
/*
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
//const stripe = require('stripe')('sk_test_51HCA8SDtboUa20CyPC9Go5FhUp6hsQoDQ4oxTRipLpBbyWFES4v0Y5KD11n4jMPdsFF6U0LWTUZIXcWVdscVOO9C008sFZdNpw');

router.post('/account_session', async (req, res) => {
    try {
        const accountSession = await stripe.accountSessions.create({
        account: '{{CONNECTED_ACCOUNT_ID}}',
        components: {
            account_onboarding: {
            enabled: true,
            features: {
                external_account_collection: true,
            },
            },
            account_management: {
            enabled: true,
            features: {
                external_account_collection: true,
            },
            },
            balances: {
            enabled: true,
            features: {
                instant_payouts: true,
                standard_payouts: true,
                edit_payout_schedule: true,
            },
            },
            payments: {
            enabled: true,
            features: {
                refund_management: false,
                dispute_management: false,
                capture_payments: true,
                destination_on_behalf_of_charge_management: false,
            },
            },
        },
        });
        res.json({
            client_secret: accountSession.client_secret,
          });
        } catch (error) {
          console.error('An error occurred when calling the Stripe API to create an account session', error);
          res.status(500);
          res.send({error: error.message});
        }
    });
//#################### DB ROUTES #################################

*/

module.exports = router;
