const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const unlocksDoor = require('./routes/homeassistantwebhook');
const { port } = require('../config/index');
//const lockStatus = require('./routes/test');
//for testing
const STRIPE_API_TEST_KEY = process.env.STRIPE_API_TEST_KEY;
const ENDPOINT_TEST_SECRET = process.env.ENDPOINT_TEST_SECRET;
//for production
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);
const ENDPOINT_SECRET = process.env.ENDPOINT_SECRET;

const app = express();

// Use body-parser JSON middleware
app.use(bodyParser.raw({ type: 'application/json' }));

//Routes
app.post('/webhooks', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENDPOINT_SECRET);
    // Handle the checkout.session.completed event
    if (event.type === 'payment_intent.succeeded') {
      const session = event.data.object;
      console.log('payment intent succeded log');
      // Call your function to unlock the door
      unlocksDoor();
    } else {
      console.log('payment intent error');
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
