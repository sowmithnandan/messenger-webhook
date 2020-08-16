'use strict';
require('dotenv').config();
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  request=require('request');
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  console.log(PAGE_ACCESS_TOKEN);
var response=require('./response/response'),
    fs=require('fs');
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
  
    // Gets the message. entry.messaging is an array, but 
    // will only ever contain one message, so we get index 0
    let webhook_event = entry.messaging[0];
    console.log(webhook_event);
    // Get the sender PSID
    let sender_psid = webhook_event.sender.id;
    console.log('Sender PSID: ' + sender_psid);
    // Check if the event is a message or postback and
    // pass the event to the appropriate handler function
    if (webhook_event.message) 
        {
        handleMessage(sender_psid, webhook_event.message);        
        }  
      else if (webhook_event.postback) 
        {
        handlePostback(sender_psid, webhook_event.postback);
        }
    });
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });
  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "9000435264"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });

function verifUser(id)
  {
  try{
  var users_array=[];
  users_array=JSON.parse(fs.readFileSync('Users.txt'));
  if(id in users_array)
    {
      return 1;
    }
  return 0;
  }
  catch(e)
    {
    return 0;
    }
  }
  // Handles messages events
function handleMessage(sender_psid, received_message) {
  let response,response_one,response_two;
  var already_user=verifyUser(sender_psid);
  // Check if the message contains text
  if(received_message.text && received_message.quick_reply!=undefined &&already_user==1)
    {
    response={
      "text":"Hello Welcome Back"
    }
    }
  else if (received_message.text && received_message.quick_reply!=undefined) 
    {    
    let local_response=response.initialMessages();
    }  
  else if(received_message.quick_repy && received_message.text)
      {
      response=response.sign_up();
      fs.appendFileSync('Users.txt',JSON.stringify(sender_psid));
      }
  else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response =response.response_attachment(); 
    } 
      

  // Sends the response message
  callSendAPI(sender_psid, response);
  if(response_one!=undefined && response_two!=undefined)
    {
      callSendAPI(sender_psid, response_one);
      callSendAPI(sender_psid, response_two);
    }

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": "EAAEfRMqZCgEwBAN17oo9T361LOonKCm9hw98DKh6YL7VLzVZA88AVDSzBklZBidDlSAq8QBUz0N1jLHVFds5Y6j0Ddjrtw1wL0ZBDSbaYUuZBrugGKZAo6k2ebZCJTorS6R9VbX9AbAVG2oe9eCsNQwAwUBscCTSRZBHaxFBVMHtDRnqTlqkEHtK" },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      console.log(process.env.PAGE_ACCESS_TOKEN);
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

