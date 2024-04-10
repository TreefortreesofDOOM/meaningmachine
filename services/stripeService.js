const stripe = require('stripe')(config.stripeApiTestKey);
const logger = require('../utils/logger');
const { unlocksArt } = require('./artUnlockService');
const { unlocksDoor } = require('./doorUnlockService');

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    // Stripe webhook handling logic...
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        
        if (event.type === 'payment_intent.succeeded') {
            const metadata = event.data.object.metadata;
            
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
        logger.error(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
