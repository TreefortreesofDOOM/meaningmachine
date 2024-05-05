const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const stripe = require('stripe')('sk_test_51HCA8SDtboUa20CyPC9Go5FhUp6hsQoDQ4oxTRipLpBbyWFES4v0Y5KD11n4jMPdsFF6U0LWTUZIXcWVdscVOO9C008sFZdNpw');
//const unlocksDoor = require('./routes/homeassistantwebhook');
const lockStatus = require('./routes/test');
const { port, stripe_api_test_key, stripe_secret, stripe_wh_secret } = require('../config/index');

const app = express();

//TODO:
  //Set-up mongoDB

// Use body-parser JSON middleware
app.use(bodyParser.raw({ type: 'application/json' }));

//Routes
app.post('/webhooks', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripe_secret);
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
