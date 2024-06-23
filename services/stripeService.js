const config = require('../config');
const stripe = require('stripe')(`${config.stripe_api_key}`);
const logger = require('../utils/logger');
//const { unlocksArt } = require('./artUnlockService');
const { unlocksDoor, unlocksArt, unlocksWall } = require('./unlockService');
const endpointSecret = process.env.ENDPOINT_SECRET;
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        //console.log('event:', event);
        if (event.type === 'checkout.session.completed') {
            console.log('checkout session completed log client_reference_id', event.data.object.client_reference_id);
            const clientReferenceId = event.data.object.client_reference_id;
            console.log('payment intent succeded log', clientReferenceId);
            if (clientReferenceId === 'Art') {
                logger.info('Unlocking art...');
                await unlocksArt();
            } else if (clientReferenceId === 'Entry') {
                logger.info('Unlocking front door...');
                await unlocksDoor();
            } else if (clientReferenceId === 'Wall') {
                logger.info('Unlocking wall art...');
                await unlocksWall();
            }
        } else {
            logger.info('Unhandled event. This stripe event is not checkout.session.completed');
        }
        res.json({ received: true });
    } catch (err) {
        logger.error(`Webhook Error A: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};