

/**
 * The JWT token you get after authenticating with our API.
 * Check the Authentication section of the documentation for more details.
 */
const accessToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjUxNDg4NDA3OTg3MTU5MDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoiV2E3WFB2ZlFLalUyWmZqMXhoeThIZ01OMG1SNGdFWFNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjQ0MTYyNTAxLCJleHAiOjE2NDQyNDg5MDEsImF6cCI6IldhN1hQdmZRS2pVMlpmajF4aHk4SGdNTjBtUjRnRVhTIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qWRfnjvy79VUcs9fVkUbO9PyuNWe1bEDtKCsmnFM2mm5UV_052IRFo77Q8HeC6JllbMnQp1IHu6HxtugCKRzqMkTyqKg5iJKLTLUSWkXgoGnnuRBo5hniDuI2wi3RP190R9gOmmqJpLE0K6-LMiwSI0AAwpSXI2gVjdsfx9d7UR6XO0pkbMivIl6zdN2xucM8Wx9ruo63M4077f0p7O-BNHeVcjzWi6VTiEdXJZASBCK9_9Sh4cOiakDvZcy-RlnSnYtZY8rjlF6cyBo1eLhxn6lmwD7PvZj11bllTmF0Myt7jMlK3DL3yh2vaMqoC1BlwKcijHxtNxnGBhxz0ClgQ"
const uniqueMeetingId = btoa("user@example.com")
const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;


let conversationId;



const ws = new WebSocket(symblEndpoint);


let autoTranscript = document.getElementById('autoTranscript');
let topics = document.getElementById('topics');
let insights = document.getElementById('insights');



// Fired when a message is received from the WebSocket server
ws.onmessage = (event) => {
  // You can find the conversationId in event.message.data.conversationId;
  const data = JSON.parse(event.data);
  if (data.type === 'message' && data.message.hasOwnProperty('data')) {
    console.log('conversationId', data.message.data.conversationId);
	conversationId = data.message.data.conversationId;
  }
  if (data.type === 'message_response') {
    for (let message of data.messages) {
      console.log('Transcript (more accurate): ', message.payload.content);
	  
      autoTranscript.innerHTML += message.payload.content;

    }
  }
  if (data.type === 'topic_response') {
    for (let topic of data.topics) {
      console.log('Topic detected: ', topic.phrases)
	  
	  topics.innerHTML += ","+topic.phrases+" ";
	  
	  
    }
  }
  if (data.type === 'insight_response') {
    for (let insight of data.insights) {
      console.log('Insight detected: ', insight.payload.content);
	  
	  insights.innerHTML += insight.payload.content
	  
	  
    }
  }
  if (data.type === 'message' && data.message.hasOwnProperty('punctuated')) {
    console.log('Live transcript (less accurate): ', data.message.punctuated.transcript)
  }
  console.log(`Response type: ${data.type}. Object: `, data);
};

// Fired when the WebSocket closes unexpectedly due to an error or lost connetion
ws.onerror  = (err) => {
  console.error(err);
};

// Fired when the WebSocket connection has been closed
ws.onclose = (event) => {
  console.info('Connection to websocket closed');
};











// Fired when the connection succeeds.
ws.onopen = (event) => {
  ws.send(JSON.stringify({
    type: 'start_request',
    meetingTitle: 'Websockets How-to', // Conversation name
    insightTypes: ['question', 'action_item'], // Will enable insight generation
    config: {
      confidenceThreshold: 0.5,
      languageCode: 'en-US',
      speechRecognition: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
      }
    },
    speaker: {
      userId: 'example@symbl.ai',
      name: 'Example Sample',
    }
  }));
};



//const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });



async function startRec() {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    /* use the stream */
	
	
	
	
	/**
	 * The callback function which fires after a user gives the browser permission to use
	 * the computer's microphone. Starts a recording session which sends the audio stream to
	 * the WebSocket endpoint for processing.
	 */
	const handleSuccess = (stream) => {
	  const AudioContext = window.AudioContext;
	  const context = new AudioContext();
	  const source = context.createMediaStreamSource(stream);
	  const processor = context.createScriptProcessor(1024, 1, 1);
	  const gainNode = context.createGain();
	  source.connect(gainNode);
	  gainNode.connect(processor);
	  processor.connect(context.destination);
	  processor.onaudioprocess = (e) => {
		// convert to 16-bit payload
		const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
		const targetBuffer = new Int16Array(inputData.length);
		for (let index = inputData.length; index > 0; index--) {
			targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
		}
		// Send audio stream to websocket.
		if (ws.readyState === WebSocket.OPEN) {
		  ws.send(targetBuffer.buffer);
		}
	  };
	};


	handleSuccess(stream);
	
	
	
	
	
  } catch(err) {
    /* handle the error */
	console.log('Probblem with tts.js')
  }
}



function stopRec(){
	// Stops the WebSocket connection.
	ws.send(JSON.stringify({
	"type": "stop_request"
}));

	getInsights();
	
}

async function getInsights(){

const fetchData = {
  method: "GET",
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  //body: JSON.stringify(payload),
}


fetch("https://api.symbl.ai/v1/conversations/"+conversationId+"/analytics", fetchData).then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(responses[response.status]);
  }
  
}).then(x => new Promise(resolve => setTimeout(() => resolve(x), 2001))).then(response => {
	
  console.log('response', response);
  conversationId = response["conversationId"];
  console.log(conversationId)
  insights.innerHTML += " Total silence (secs):" + response["metrics"][0]["seconds"] + ", ";
  insights.innerHTML += " Total talk time (secs):" + response["metrics"][1]["seconds"] + ", ";
  insights.innerHTML += " wpm :" + response["members"][0]["pace"]["wpm"] + ", ";
  
  
  
  
  
  //first of response object conversationId
	
}).catch(error => {
  console.error(error);
  
});
}







