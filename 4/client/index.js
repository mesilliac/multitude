
// websocket connection for talking to the server
var server = new WebSocket("ws://" + location.host + "/connect");

// code to run when our websocket connects
server.onopen = function() {
    server.send("Hello, server!");
};

// code to run when we recieve a message from the server
server.onmessage = function(message) {
    alert(message.data);
    server.close();
};

