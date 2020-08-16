module.exports={
  initialResponse,
  sign_up,
  response_attachment
}

function initialResponse(){

    // Create the payload for a basic text message
    response_one = {
        "text": `Helloo,this is ALephNull,we can help you stay motivated `
      }
      // console.log(response);
      response_two={
        "text": "Would you like to try ?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Yes",
            "payload":"yes_for_sign_in",
            "image_url":"http://example.com/img/green.png"
          },{
            "content_type":"text",
            "title":"No",
            "payload":"no_for_sign_in",
            "image_url":"http://example.com/img/red.png"
          }
        ]
      }
    var local_responses=[]
    local_responses.push(response_one);
    local_responses.push(response_two);
    return local_responses;
}

function sign_up()
  {
    response = {
      "text": `Good choice ,we will try our best to keep you motivated `
    }
  return response;
  }

function response_attachment()
  {
    response={
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
     }
    return response;
  }