// ----------
// WEBSOCKETS
// ----------

// websocket connection for talking to the server
var server = new WebSocket("ws://" + location.host + "/connect");

// code to run when our websocket connects
server.onopen = function() {
    message = JSON.stringify({"message": "Hello, server!"});
    server.send(message);
}

// code to run when we recieve a message from the server
server.onmessage = function(message) {
    //console.log(message);
    var m = JSON.parse(message.data);
    if (m.popup) {
        alert(m.popup);
    } else if (m.message) {
        var text = m.client + ": " + m.message
        text = '<span style="color:' + m.color + '">' + text + "</span>"
        document.getElementById('textbox').innerHTML += "<br>" + text;
    } else if (m.action == "drawline") {
        var viewport = document.getElementById('viewport');
        var from = [m.from[0] * 1000, m.from[1] * 1000];
        var to = [m.to[0] * 1000, m.to[1] * 1000];
        var ctx = viewport.getContext('2d');
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]);
        ctx.stroke();
    }
}


// -------------
// text messages
// -------------

function submit_message() {
    var typebox = document.getElementById('typebox');
    var message = JSON.stringify({"message": typebox.value});
    server.send(message);
    typebox.value = "";
}


// ------------
// mouse events
// ------------

var dragging = false;
var lastpos = [];

window.onload = function () {
    var clickbox = document.getElementById('clickbox');
    clickbox.addEventListener('mousemove', onMouseMove);
    clickbox.addEventListener('mousedown', onMouseDown);
    clickbox.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event) {
    if (!dragging) { return; }
    var viewport = event.currentTarget;
    var bounds = viewport.getBoundingClientRect()
    var thispos = [(event.clientX - bounds.left) / viewport.clientWidth,
                   (event.clientY - bounds.top) / viewport.clientHeight]
    if (Math.sqrt(Math.pow((thispos[0] - lastpos[0]), 2) +
                  Math.pow((thispos[1] - lastpos[1]), 2)) > 0.005) {
        var msg = JSON.stringify({
            "action": "drag",
            "from": lastpos,
            "to": thispos
        });
        server.send(msg);
        lastpos = thispos;
    }
}

function onMouseDown(event) {
    dragging = true;
    var viewport = event.currentTarget;
    var bounds = viewport.getBoundingClientRect()
    lastpos = [(event.clientX - bounds.left) / viewport.clientWidth,
               (event.clientY - bounds.top) / viewport.clientHeight]
}

function onMouseUp(event) {
    dragging = false;
    document.getElementById('typebox').focus();
}

