require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config');

const app = express();
const PORT = config.port || 3000;

app.use(bodyParser.raw({ type: 'application/json' }));
app.use('/', routes);
/*
const SmeeClient = require('smee-client')

const smee = new SmeeClient({
  source: 'https://smee.io/98zlcGcynFwVKIDC',
  target: 'http://localhost:4242/webhook',
  logger: console
})

const events = smee.start()
*/
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});



/*
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const stripe = require('stripe')('sk_test_51HCA8SDtboUa20CyPC9Go5FhUp6hsQoDQ4oxTRipLpBbyWFES4v0Y5KD11n4jMPdsFF6U0LWTUZIXcWVdscVOO9C008sFZdNpw');
const unlocksArt = require('./routes/homeassistantwebhook');
const lockStatus = require('./routes/lockservice');
const { ha_api_key, port, stripe_api__test_key, stripe_wh_secret } = require('./config/index');

const app = express();
//TODO:
//  Set-up mongoDB
//  git-ignore api keys
//  

// Use body-parser middleware to handle the raw body required by Stripe webhooks
app.use(bodyParser.raw({ type: 'application/json' }));

//Routes & controller.
  // TODO: separate routes and controller.
app.use('/api', lockStatus);
// stripe_event_listener
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripe_wh_secret);
    // Handle the checkout.session.completed event
    if (event.type === 'payment_intent.succeeded' && event.data.object.metadata.art === 'exists') {
      const session = event.data.object;
      console.log('payment intent succeded log');
      // Call your function to unlock the door
      unlocksArt();
    } else if (event.type === 'payment_intent.succeeded' && event.data.object.metadata.entry === 'frontdoor') {
      const session = event.data.object;
      console.log('payment intent succeded log');
      // Call your function to unlock the door
      unlocksDoor(); //make this unlock a different door.
    } else {
      console.log('payment intent error');
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
// Error handler
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // logs the error to console
  res.status(err.status || 500);
  console.log(`"error from handler: " ${err.status}`);
});

app.listen(`${port}`, () => {
  console.log(`Server is listening on port ${port}`);
});
*/
