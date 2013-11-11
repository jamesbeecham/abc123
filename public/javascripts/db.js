var sig;
var api;
$(document).ready(function () {
	api = $('.sigPad').signaturePad({drawOnly: true});
});

function testing() {
	sig = $("[name='output']").val();
	var img = api.getSignatureImage(sig);
	console.log(img.length);
	var socket = io.connect('http://www.universalgolt.com:3000/');
        socket.on('connect', function () { console.log('client connected!');});
        socket.emit('sendSig', { sig: img});
}

function redraw() {
}
