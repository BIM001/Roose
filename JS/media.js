let mySrc;
/*
function openFile(){
	
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _ => {
    // you can use this method to get file and perform respective operations
            let files =   Array.from(input.files);
            console.log(files);
        };
  input.click();
}

	
document.getElementById('vidInput').onchange = function () {
  alert('Selected file: ' + this.value.replace(/.*[\/\\]/, ''));
  const [file] = document.getElementById('vidInput').files
  if (file){
	  document.getElementById("videoElement").src = URL.createObjectURL(file);
	  myFile = URL.createObjectURL(file);
	  console.log(URL.createObjectURL(file))
  }
};
*/
document.getElementById("mySrc").value =  "https://symbltestdata.s3.us-east-2.amazonaws.com/sample_video_file.mp4";


function playSrc(){
	mySrc = document.getElementById("mySrc").value;
	document.getElementById("videoElement").src = mySrc;
	console.log(mySrc)
	submitVideo()
	
}


const authToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjUxNDg4NDA3OTg3MTU5MDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiV2E3WFB2ZlFLalUyWmZqMXhoeThIZ01OMG1SNGdFWFNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjQ0MTYyNTAxLCJleHAiOjE2NDQyNDg5MDEsImF6cCI6IldhN1hQdmZRS2pVMlpmajF4aHk4SGdNTjBtUjRnRVhTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qWRfnjvy79VUcs9fVkUbO9PyuNWe1bEDtKCsmnFM2mm5UV_052IRFo77Q8HeC6JllbMnQp1IHu6HxtugCKRzqMkTyqKg5iJKLTLUSWkXgoGnnuRBo5hniDuI2wi3RP190R9gOmmqJpLE0K6-LMiwSI0AAwpSXI2gVjdsfx9d7UR6XO0pkbMivIl6zdN2xucM8Wx9ruo63M4077f0p7O-BNHeVcjzWi6VTiEdXJZASBCK9_9Sh4cOiakDvZcy-RlnSnYtZY8rjlF6cyBo1eLhxn6lmwD7PvZj11bllTmF0Myt7jMlK3DL3yh2vaMqoC1BlwKcijHxtNxnGBhxz0ClgQ";
let conversationId;


async function submitVideo(){

const payload = {
  'url': mySrc,
  // A valid url string. The URL must be a publicly accessible url.
  //'name': "Interview Prep",
  // <Optional, string| your_conversation_name | Your meeting name. Default name set to conversationId.>
  // 'webhookUrl': "https://yourdomain.com/jobs/callback",
  // <Optional, string| your_webhook_url| Webhook url on which job updates to be sent. (This should be post API)>
  //'customVocabulary': ['Platform', 'Discussion', 'Targets'],
  // <Optional, list| custom_vocabulary_list> |Contains a list of words and phrases that provide hints to the speech recognition task.
  'confidenceThreshold': 0.5,
  // <Optional, double| confidence_threshold | Minimum required confidence for the insight to be recognized.>
  //'detectPhrases': true,
  // <Optional, boolean| detect_phrases |Accepted values are true & false. It shows Actionable Phrases in each sentence of conversation. These sentences can be found in the Conversation's Messages API.>
  'languageCode': "en-US"  // <Optional, boolean| language_code> |code of language of recording.>
};

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



fetch("https://api.symbl.ai/v1/process/video/url", fetchData).then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(responses[response.status]);
  }
  
}).then(x => new Promise(resolve => setTimeout(() => resolve(x), 20001))).then(response => {
	
  console.log('response', response);
  conversationId = response["conversationId"];
  console.log(conversationId)
  
  //first of response object conversationId




const fetchData1 = {
  method: "GET",
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  }
}

const url = "https://api.symbl.ai/v1/conversations/"+conversationId+"/messages"

console.log(url)
return fetch(url, fetchData1)  

}).then(response => {

  if (response.ok) {
	return response.json();
  } else {
	throw new Error(responses[response.status]);
  }
  
  
}).then(responses => {
	
  console.log('response', responses);
  
  
  var transcript = document.getElementById('transcript');

  
  for (let i=0; i < responses["messages"].length; i++){
	  transcript.innerHTML += responses["messages"][i]["text"];
  }

  
  
  

}).then(response => {




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
