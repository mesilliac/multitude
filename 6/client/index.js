
// websocket connection for talking to the server
var server = new WebSocket("ws://" + location.host + "/connect");

// code to run when our websocket connects
server.onopen = function() {
    message = JSON.stringify({"message": "Hello, server!"});
    server.send(message);
}

// code to run when we recieve a message from the server
server.onmessage = function(message) {
    console.log(message);
    var m = JSON.parse(message.data);
    if (m.popup) {
        alert(m.popup);
    } else if (m.message) {
        document.getElementById('textbox').innerHTML = m.message;
    }
}

function submit_message() {
    var typebox = document.getElementById('typebox');
    var message = JSON.stringify({"message": typebox.value});
    server.send(message);
    typebox.value = "";
}
