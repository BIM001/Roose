const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjUxNDg4NDA3OTg3MTU5MDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiV2E3WFB2ZlFLalUyWmZqMXhoeThIZ01OMG1SNGdFWFNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjQ0MTYyNTAxLCJleHAiOjE2NDQyNDg5MDEsImF6cCI6IldhN1hQdmZRS2pVMlpmajF4aHk4SGdNTjBtUjRnRVhTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qWRfnjvy79VUcs9fVkUbO9PyuNWe1bEDtKCsmnFM2mm5UV_052IRFo77Q8HeC6JllbMnQp1IHu6HxtugCKRzqMkTyqKg5iJKLTLUSWkXgoGnnuRBo5hniDuI2wi3RP190R9gOmmqJpLE0K6-LMiwSI0AAwpSXI2gVjdsfx9d7UR6XO0pkbMivIl6zdN2xucM8Wx9ruo63M4077f0p7O-BNHeVcjzWi6VTiEdXJZASBCK9_9Sh4cOiakDvZcy-RlnSnYtZY8rjlF6cyBo1eLhxn6lmwD7PvZj11bllTmF0Myt7jMlK3DL3yh2vaMqoC1BlwKcijHxtNxnGBhxz0ClgQ";







let conversationId;


async function submitText(){


var Transcript = document.getElementById('Transcript');
console.log(Transcript.value)

const payload = {
  // <Optional,String| your_meeting_name by default conversationId>
  "name": "speech",
  // <Optional,double| Minimum required confidence for the insight to be recognized. Value ranges between 0.0 to 1.0. Default value is 0.5.>
  "confidenceThreshold": 0.5,
  // <Optional,boolean| It shows Actionable Phrases in each sentence of conversation. These sentences can be found using the Conversation's Messages API. Default value is false.>
  "detectPhrases": false,
  "messages": [
    {

      // <Optional, object| Duration object containing startTime and/or endTime for the transcript.>, e.g.
      "duration": {
        "startTime": "2020-07-21T16:04:19.99Z",
        "endTime": "2020-07-21T16:04:20.99Z"
      },
      "payload": {
        "content": Transcript.value
      
      },
      // <Optional, object| Information about the User information i.e. name and/or userId, produced the content of this message.>
      "from": {
        "name": "User",
        "userId": "User@user.com"
      }
    }
  ]
}//bm 2022

const responses = {
  400: 'Bad Request! Please refer docs for correct input fields.',
  401: 'Unauthorized. Please generate a new access token.',
  404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
  429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
  500: 'Something went wrong! Please contact support@symbl.ai'
}




const fetchData = {
  method: "POST",
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
}




fetch(`https://api.symbl.ai/v1/process/text?enableSummary=true`, fetchData).then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(responses[response.status]);
  }
  
}).then(x => new Promise(resolve => setTimeout(() => resolve(x), 1001))).then(response => {
	
  console.log('response', response);
  conversationId = response["conversationId"];
  console.log(conversationId)
  
  //first of response object conversationId

const fetchData2 = {
  method: "GET",
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  }
}










const url = "https://api.symbl.ai/v1/conversations/"+conversationId+"/topics?sentiment=true";
console.log(url)

return fetch(url, fetchData2)  
  
}).then(response => {

  if (response.ok) {
	return response.json();
  } else {
	throw new Error(responses[response.status]);
  }
  
  
}).then(responses => {
	
  console.log('response', responses);
  var topics = document.getElementById('topics');
  
  for (let i=0; i < responses["topics"].length; i++){
	  topics.innerHTML += responses["topics"][i]["text"] + ", ";
  }

}).then(response => {
	
  

const fetchData3 = {
  method: "GET",
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  }
}

const url2 = "https://api-labs.symbl.ai/v1/conversations/"+conversationId+"/abstract-topics";
console.log(url2)

return fetch(url2, fetchData3)  
  
}).then(response => {

  if (response.ok) {
	return response.json();
  } else {
	throw new Error(responses[response.status]);
  }
  
  
}).then(responses => {
	
  console.log('abstract response', responses);
  var abstractTopics = document.getElementById('abstractTopics');
  
  for (let i=0; i < responses["abstractTopics"].length; i++){
	  abstractTopics.innerHTML += responses["abstractTopics"][i]["text"] + ", ";
  }

}).then(response => {
	
  

const fetchData4 = {
  method: "GET",
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  }
}

const url3 = "https://api-labs.symbl.ai/v1/conversations/"+conversationId+"/summary";
console.log(url3)

return fetch(url3, fetchData4)  
  
}).then(response => {

  if (response.ok) {
	return response.json();
  } else {
	throw new Error(responses[response.status]);
  }
  
  
}).then(responses => {
	
  console.log('abstract response', responses);
  var summary = document.getElementById('summary');

  for (let i=0; i < responses["summary"].length; i++){
	  summary.innerHTML += responses["summary"][i]["text"];
  }

}).catch(error => {
  console.error(error);
  
}); 




}
