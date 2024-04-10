const config = require('../config');
const stripe = require('stripe')(`${config.stripe_api_test_key}`);
const logger = require('../utils/logger');
const { unlocksArt } = require('./artUnlockService');
const { unlocksDoor } = require('./doorUnlockService');
const endpointSecret = config.endpointSecret;
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        
        if (event.type === 'payment_intent.succeeded') {
            const metadata = event.data.object.descrption;
            console.log('payment intent succeded log', metadata);
            if (metadata === 'Meaning Machine Entry') {
                logger.info('Unlocking art...');
                await unlocksArt();
            } else if (metadata.Entry === 'frontdoor') {
                logger.info('Unlocking front door...');
                await unlocksDoor();
            }
        } else {
            logger.info('Unhandled event type 1');
        }
        
        res.json({ received: true });
    } catch (err) {
        logger.error(`Webhook Error A: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
    res.send();
};
