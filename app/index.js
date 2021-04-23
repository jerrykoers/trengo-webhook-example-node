var express = require('express');
const CryptoJS = require("crypto-js");
// const { Client } = require('pg');
require('dotenv').config();

/*
// connect to database on Heroku
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT * FROM postgresql-asymmetrical-24775;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
*/

// insert your signing secret in the .env file
const signingSecret = process.env.SIGNING_SECRET || '';

if(!signingSecret || signingSecret === 'V3rpl03g3n637') {
  console.warn('No signing secret defined! You can define the SIGNING_SECRET in your Heroku settings: https://devcenter.heroku.com/articles/config-vars#using-the-heroku-dashboard');
}

// start the express server
const app = express();
app.listen(process.env.PORT || 8080);

// parse URLEncoded and save the raw body to req.rawBody
app.use(
  express.urlencoded({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
    limit: '1mb',
    extended: true,
    type: "application/x-www-form-urlencoded"
  })
);

app.get("/*", (req, res) => {
  // res.render('pages/dashboard');
  res.send("Trengo dashboard - Verploegen APP");
});

app.post("/voice-call-started", (req, res) => {
  res.send("Trengo Dashboard - Voice call started");
  console.log('---------------------------------------------------------------------------') // Call your action on the request here
  console.log(req.body.channel_id + ' - ' + req.body.ticket_id + ' - ' + req.body.user_name) // Call your action on the request here
  console.log(req.body) // Call your action on the request here
  console.log('---------------------------------------------------------------------------') // Call your action on the request here
  res.status(200).end() // Responding is important
})

app.post("/voice-call-ended", (req, res) => {
  res.send("Trengo Dashboard - Voice call ended");
  console.log('---------------------------------------------------------------------------') // Call your action on the request here
  console.log(req.body.channel_id + ' - ' + req.body.ticket_id + ' - ' + req.body.user_name) // Call your action on the request here
  console.log(req.body) // Call your action on the request here
  console.log('---------------------------------------------------------------------------') // Call your action on the request here
  res.status(200).end() // Responding is important
})

app.post("/voice-call-missed", (req, res) => {
  res.send("Trengo Dashboard - Voice call missed");
  console.log('---------------------------------------------------------------------------') // Call your action on the request here
  console.log(req.body.channel_id + ' - ' + req.body.ticket_id + ' - ' + req.body.user_name) // Call your action on the request here
  console.log(req.body) // Call your action on the request here
  console.log('---------------------------------------------------------------------------') // Call your action on the request here
  res.status(200).end() // Responding is important
})

/*
// listen for POST requests to '/voice-call-started'
app.post("/voice-call-started", (req, res) => {
  // get signature header
  const signature = req.header("Trengo-Signature") || '';
  // get raw request body
  const payload = req.rawBody || '';

  // verify the signature
  if (verify(payload, signature, signingSecret)) {
    res.send("Trengo Dashboard - Voice call started");
    console.log("Do something with the body", req.body);
  } else {
    res.status(401).send("Unauthorized");
    console.error("invalid signature, did you correctly set your SIGNING_SECRET?");
  }
});

app.post("/voice-call-ended", (req, res) => {
  // get signature header
  const signature = req.header("Trengo-Signature") || '';
  // get raw request body
  const payload = req.rawBody || '';

  // verify the signature
  if (verify(payload, signature, signingSecret)) {
    res.send("Trengo Dashboard - Voice call ended");
    console.log("Voice call ended", req.body);
  } else {
    res.status(401).send("Unauthorized");
    console.error("invalid signature, did you correctly set your SIGNING_SECRET?");
  }
});

app.post("/voice-call-missed", (req, res) => {
  // get signature header
  const signature = req.header("Trengo-Signature") || '';
  // get raw request body
  const payload = req.rawBody || '';

  // verify the signature
  if (verify(payload, signature, signingSecret)) {
    res.send("Trengo Dashboard - Voice call missed");
    console.log("Voice call missed", req.body);
  } else {
    res.status(401).send("Unauthorized");
    console.error("invalid signature, did you correctly set your SIGNING_SECRET?");
  }
});

// listen for POST requests to '/my-endpoint'
app.post("/my-endpoint", (req, res) => {
  // get signature header
  const signature = req.header("Trengo-Signature") || '';
  // get raw request body
  const payload = req.rawBody || '';

  // verify the signature
  if (verify(payload, signature, signingSecret)) {
    res.send("Valid signature");
    console.log("Do something with the body", req.body);
  } else {
    res.status(401).send("Unauthorized");
    console.error("invalid signature, did you correctly set your SIGNING_SECRET?");
  }
});

// listen for POST requests to '/my-endpoint'
app.post("/voice-call-started", (req, res) => {
  // get signature header
  const signature = req.header("Trengo-Signature") || '';
  // get raw request body
  const payload = req.rawBody || '';

  // verify the signature
  if (verify(payload, signature, signingSecret)) {
    res.send("Trengo Dashboard - Voice call started");
    console.log("Do something with the body", req.body);
  } else {
    res.status(401).send("Unauthorized");
    console.error("invalid signature, did you correctly set your SIGNING_SECRET?");
  }
});
*/

// the function to verify the trengo-signature
function verify(payload, signature, signingSecret) {
  // split the timestamp from the hash
  const signatureParts = signature.split(";");
  const timestamp = signatureParts[0];
  const signatureHash = signatureParts[1];

  // generate a hash to compare with
  // 1. get the raw digest bytes
  let hash = CryptoJS.HmacSHA256(timestamp + "." + payload, signingSecret);

  // 2. encode the raw bytes as hexadecimal digits
  hash = hash.toString(CryptoJS.enc.hex);

  // 3. and make the hexadecimal digits lowercase
  hash = hash.toLowerCase();

  // compare our generated hash to the hash from the 'Trengo-Signature' header.
  // if they are the same, the signature is valid.
  return hash === signatureHash;
}
