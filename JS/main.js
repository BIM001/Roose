var video = document.querySelector("#webcamElement");

function connectWebcam(){
	if (navigator.mediaDevices.getUserMedia) {
	  navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
		  video.srcObject = stream;
		})
		.catch(function (err0r) {
		  console.log("Something went wrong!");
		});
	}
}



















