Step-by-step documentation on the talk.

Step 0: Hello World
===================

First we will want to make sure everything works,
and that we can set up a webserver and connect to it.

(a) clone this git repository somewhere
---------------------------------------

Find a nice location and clone the repository there

    git clone https://github.com/mesilliac/multitude.git

(b) create a server.py
----------------------

### touch the file ###

    cd multitude
    touch server.py
    chmod +x server.py

### header and imports ###

Inside this file we put the basic tornado webapp.

The header is pretty standard:

    #!/usr/bin/python
    # coding: utf-8
    """A simple webserver."""

If using python 2.7 we'll need to enable
`print_function` (for code compatibility with python 3)
and `unicode_literals` (for tornado's sanity).
I also like `division`, but there's no need for it here.

    # python 2.7 compatibility
    from __future__ import print_function, unicode_literals

Our imports for now are just `tornado.ioloop` and `tornado.web`.

    # based on tornado
    import tornado.ioloop
    import tornado.web

### tornado.web.Application and tornado.web.StaticFileHandler ###

To serve our app, we create an application using `tornado.web.Application`.
For now all we will define is the location to serve our client from.
The client will be written in html,
and served from the "client" directory.
So that the client can also define separate resource files,
such as art assets, css and javascript files,
we serve everything from the "client" directory as-is.
To do this we can use a `tornado.web.StaticFileHandler`.

    def make_app():
        return tornado.web.Application([
            (r"/(.*)", tornado.web.StaticFileHandler, {
                "path": "client",
                "default_filename": "index.html"
            }),
        ], debug=True)
    
`tornado.web.Application` takes a list of tuples as arguments,
each one representing a URL pattern,
a handler for requests to this URL pattern,
and arguments to be used when creating the request handler.

The url pattern must be defined as a raw string literal,
and will match via regular expression.
In this case we can use `r"/(.*)"`,
which will match everything under the root "/" url - i.e. everything.
The regular expression group `(.*)` will be passed to the handler.
In our case the `StaticFileHandler` uses it as a relative path,
and sends any files it finds matching this path to the client.

`StaticFileHandler` is a built-in request handler,
which will send the client files from a subdirectory,
according to the URL sent by the client.
We define the directory to serve files from by the "path" argument,
in this case using the "client" subdirectory.
We also define a "default_filename" argument,
which is used when no filename is specified in the URL.

As such, when the client requests `http://my_webapp.com/pics/somepic.jpg`
this will be served from `client/pics/somepic.jpg`,
and when the client requests `http://my_webapp.com/` alone,
it will be served from `client/index.html`.

The final argument to `Application`, `debug=True`
sets various debug options, such as enabling tracebacks to the client.
One notable useful option is that every time we make changes to `server.py`,
the webserver will restart itself incorporating the changes.
Later we may wish to turn this off,
but for now it speeds up development significantly.

### serving the webapp ###

Now that we have defined our application,
we can create an instance of it and tell it to listen for connections.

    if __name__ == "__main__":
        # start the webapp on port 8888
        app = make_app()
        app.listen(8888)
        print("webapp started on port 8888")

Here we're starting it on port 8888, for testing,
which will means it can be accessed via `http://localhost:8888/`.
When deploying it as a standalone webserver it could be set to port 80,
in which case the port wouldn't need to be specified as part of the URL.

Finally we start the main tornado IO Loop.
This handles client connections,
as well as running the webserver,
and handling and callbacks we may define.

        tornado.ioloop.IOLoop.current().start()

With this done, we should have a fully functional webserver,
serving static content from the "client" subdirectory.


(c) create a client/index.html
------------------------------

Of course, we don't yet have anything to serve,
so let's create a bare bones HTML file to test that it works.
Save the following as `client/index.html`.

    <!DOCTYPE html>
    <meta charset="utf-8"/>
    <title>My Awesome Webapp</title>
    
    Hello, World!


(d) test that it all works
--------------------------

Now that we have the basic client and server,
try it out!

### run the server ###

First run the server.

This should be done in a console window,
so that if something goes wrong you can see the output,
and so you can kill it easily if necessary.

    python server.py

or

    python3 server.py

or just

    ./server.py

When it starts, it should print the message we had above,
"Webapp started on port 8888".

### load the client ###

Once the server has started,
connect to it using your favourite web browser by navigating to:

http://localhost:8888

We should now see a blank webpage,
with the raw text "Hello, World!".

### test client file changes ###

Now that we have the server and client working,
we should be able to make changes and fixes to the client files on the fly.

Try changing the "Hello, World!" message in index.html to something else,
then reload the page in your web browser (usually CTRL-R, or F5)
to see the changes.

### test server file changes ###

To make sure our server is nicely reloading,
we can add some simple info about the python and tornado versions.

To our import section, add an

    import sys

and at the start of execution print the Tornado and Python versions:

    if __name__ == "__main__":
        # print some basic info about the system
        print("Running Tornado Web Server {}".format(tornado.version))
        print("Using Python {}".format(sys.version))
        
        # start the webapp on port 8888
        (...)

As soon as you save the file,
you should be able to see the server reload.
In the console window in which you started it,
it should immediately print the new version info,
and then the same "Webapp started on port 8888" message as before.


Step 1: decide on what form the client application will take
============================================================

For an interactive web application,
we'll need to specify how we want to interact with an end-user.
Currently we just have a raw webpage,
but we'll need some sort of user interface to continue.

As this doesn't have much to do with Python we can skip over this.
In real life, we can often also skip over this!
Simply pass it off to your friend / coworker / design team,
and ask them to design the interface.

As we have clearly separated the client files in the "client" directory,
and as we serve everything from this directory as a standard web server,
our UI designers and Javascript coders can update these files as they please.

### make a square region for our client UI ###

For now, we will simply specify that we want to display our app in a square.
We will have a square region,
in which several people can interact together using our webapp.

Surely it will be fun!

The web design team tweaks our `client/index.html` "Hello, World",

    <div id="origin">
        <div id="viewport"></div>
        <div id="textbox">
            Hello, World!
        </div>
    </div>

adds a stylesheet link to the header:

    <meta charset="utf-8"/>
    <title>My Awesome Webapp</title>
    <link rel="stylesheet" href="index.css">

and gives us a new CSS file to serve as `index.css`.

    body {
        overflow: hidden;
        padding: 0;
        margin: 0;
        background-color: #ccc;
    }
    #origin {
        width: 0;
        height: 0;
        position: absolute;
        top: 50vh;
        left: 50vw;
    }
    #viewport {
        width: 100vmin;
        height: 100vmin;
        position: absolute;
        top: -50vmin;
        left: -50vmin;
        background-color: #fff;
    }
    #textbox {
        position: absolute;
        width: 100vmin;
        top: -0.5em;
        left: -50vmin;
        text-align: center;
    }

As we've already set up our `staticFileHandler`
to serve everything from the "client" directory,
we can just put the `index.css` there.
We can do this without even reloading the webserver.

Full versions of these index.html and index.css files
can be found in the "1/client" directory,
So if you like you can copy them from there.

### update the client files and test ###

After placing the new files in the "client" directory
we can reload our web page in the client,
and we should see a white square region with "Hello, World!" in the center.

You can try resizing your browser window.
The region should automatically resize to match,
maintaining its square shape
as well as the position of the "Hello, World".


Step 2: Websocket Connection
============================

Now that we have a client and a server,
we can start thinking about how they should talk to each other.

For a typical polling-based webapp,
where the page only changes when the client reloads or clicks on a link,
we could have our application react to certain URLs.
However as we want to have continuous two-way real-time interaction,
we will use the interface designed specifically for this: websockets.

### Adding websockets to our server ###

First we should add tornado's websocket module to our import section,
which becomes:

    # based on tornado
    import tornado.ioloop
    import tornado.web
    import tornado.websocket

Our basic websocket interface is `tornado.websocket.WebSocketHandler`,
which is a type of `RequestHandler` dealing with websocket connections.

We begin by subclassing `tornado.websocket.WebSocketHandler`.
When connections are opened and closed,
and when messages are received,
methods on our class will be called to handle these events.

For now we can start with only the "open" method,
which will be called when a websocket connection is initiated.

    class ClientSocket(tornado.websocket.WebSocketHandler):
        def open(self):
            # print some info about the opened connection
            print("WebSocket opened",
                  "from user at {}".format(self.request.remote_ip))

We add this connection interface to our `tornado.web.Application`
in a similar way to the `tornado.web.StaticFileHandler`.
Here all we need to do is add another list item before our file handler,
which becomes:

    return tornado.web.Application([
        (r"/connect", ClientSocket),
        (r"/(.*)", tornado.web.StaticFileHandler, {
            "path": "client",
            "default_filename": "index.html"
        }),
    ], debug=True)

Items higher in the list will be checked first,
so now when a client requests the "/connect" URL
it will pass to our `ClientSocket` handler,
in stead of the `StaticFileHandler`.

This should be all we need to do to add basic websocket support to our server.

### adding websockets to the client ###

Websocket usage in javascript is even easier.

To our `client/index.html`, we can add a script element to the header:

    <meta charset="utf-8"/>
    <title>My Awesome Webapp</title>
    <link rel="stylesheet" href="index.css">
    <script src="index.js"></script>

Then we add a new file for our script, `client/index.js`,
containing just one line:

    var server = new WebSocket("ws://" + location.host + "/connect");

This will create a websocket connection to our server
as soon as the page starts to load.

### try it out ###

Assuming there weren't any errors in the code,
we should be able to test our connection without reloading the server.

Simply refresh the browser page.
It should open a websocket connection with the server,
which should print a message to the console.
Something like

    WebSocket opened from user at 127.0.0.1

Success! A connection!


Step 3: Basic Communication
===========================

Now that we have a communication channel,
we can use it to send and receive messages!

### receiving messages on the server ###

On our server, we can receive messages by adding an `on_message` method
to our `ClientSocket` class.
This method will be called automatically whenever we receive a message,
with the message data as the argument.

    def on_message(self, message):
        # print the message to the console
        print("client sent: {!r}".format(message))

Here we simply print whatever the client sent to the console.

### sending messages to the client ###

To send a message to the client we can call the `write_message` method,
which is inherited from `tornado.websocket.WebSocketHandler`.

If we add it to our `on_message` handler,
we can automatically respond every time we receive a message.

    def on_message(self, message):
        # print the message to the console
        print("client sent: {!r}".format(message))
        
        # respond to the message
        self.write_message("Hello, client!")

### client message handling ###

On the client side, message handling is almost identical,
although in Javascript in stead of Python.

Add the following to our `client/index.js`:

    // code to run when our websocket connects
    server.onopen = function() {
        server.send("Hello, server!");
    }

    // code to run when we receive a message from the server
    server.onmessage = function(message) {
        alert(message.data);
    }

Now when the client opens the websocket connection,
it will send the server a message "Hello, server!".

If the server sends anything to the client,
it will pop up a window with whatever it says.

Note that on the Javascript side the "message" is a container object,
and the data must be accessed via `message.data`.

### try it out ###

Refreshing our page should now pop up an alert box saying "Hello, client!"


Step 4: Closing sockets
=======================


After opening sockets and sending and receiving messages,
The last basic thing to handle is closing the sockets.

A socket can be closed by calling the `close` method,
and code can be executed in the `on_close` method.
Let's print out some connection info when a socket is closed.

    def on_close(self):
        # print some info about the closed connection
        print("WebSocket closed",
              "by user at {}".format(self.request.remote_ip))

In addition to the basic information,
websockets can optionally specify a reason for closing.
This is done via one or both of a short code with specified meaning,
and a text message explaining the closure.
When a websocket is closed,
these will be assigned to `self.close_code` and `self.close_reason`.
If not given, these will be `None`.

        print("close code: {}".format(self.close_code))
        print("close reason: {!r}".format(self.close_reason))

A list of these short codes and their meanings can be found at
https://tools.ietf.org/html/rfc6455#section-7.4.1

To test the closing, let's add some code to `server.onmessage` in our client
to close the connection after it receives a message.

In `client/index.js`:

    server.onmessage = function(message) {
        alert(message.data);
        server.close(1000, "message received");
    }

### verify that it works ###

Once these changes are saved, refresh the client page in your browser.

Before closing the "Hello, client!" alert message,
verify in the console that the server hasn't closed the connection.

After the alert message is dismissed,
the server should print some info, such as

    WebSocket closed by user at 127.0.0.1
    close code: 1000
    close reason: u'message received'


Step 5: JSON messages
=====================

Now that we have a communication channel,
we're ready to start sending useful messages between the client and server.

A nice simple format that works well in both Python and Javascript, is JSON.
It has the added benefit that it's human-readable,
which makes debugging easier.
Websockets can also send binary data, in both stream and blob form,
but for now we'll stick to text-only.
Unless you know it's really going to be a bottleneck,
sticking with human-readable data formats is a big plus for development.

First let's convert what we already have to use JSON.

### server ###

Python has several nice json modules,
but for now we can just add the built-in `json` to our imports:

    import json

In our message response, replace

        self.write_message("Hello, client!")

with

        response = {"popup" : "Hello, client!"}
        m = json.dumps(response)
        self.write_message(m)

`json.dumps` can take a a python string, number, dictionary or array,
and will output a string representation of them in JSON form.
This string will almost always look like native Python, which is great.

If we refresh our client webpage now,
we can see the exact JSON message sent by our server,
which should look something like:

    {"popup": "Hello, client!"}

That's not the intention, though.
the benefit of using JSON is that we can parse it on the client,
and perform different actions depending on the message.

### client ###

In this case let's modify our `client/index.js`
so that it makes a popup window with the text of "popup" from the message.

    server.onmessage = function(message) {
        var m = JSON.parse(message.data);
        if (m.popup) {
            alert(m.popup);
        }
    }

Now when we refresh, we should see what we originally had,
a popup window with

    Hello, client!

On the javascript side, it's useful to be able to debug the actual messages,
so we can also log them to the javascript console using `console.log()`.

    server.onmessage = function(message) {
        console.log(message);
        var m = JSON.parse(message.data);
        if (m.popup) {
            alert(m.popup);
        }
    }

This console can be opened in Firefox with CTRL-SHIFT-K,
and in Chrome with CTRL-SHIFT-J.

While we're at it, let's also update our javascript to send using JSON.

    server.onopen = function() {
        message = JSON.stringify({"message": "Hello, server!"});
        server.send(message);
    }

Now our server should show the new JSON-format messages

    client sent: u'{"message":"Hello, server!"}'


Step 6: Doing something with messages
=====================================

Now that we have a framework for passing messages back and forth
between our client and server,
we can start actually creating our awesome app!

While the design team is coming up with something better than popups,
we can think about what we actually want our app to do.

For this example, we'll try to combine two things.
One is sending small single-sentence messages,
and the other is a shared sketchpad where clients can draw simultaneously.

For the messages,
our clients should be able to send messages to each other,
and these messages should appear immediately to all clients.

For the sketchpad,
clients should be able to draw in a common area,
and see each others' sketches appear in real-time as they draw.

### message format ###

For these two requirements,
our messages already mostly support the first.
We can send messages with a format such as:

    {"client": "mary", "message": "mary's message to everyone"}

For the second, we'll need to specify several things about what is being drawn.
We can have something like:

    {"client": "mary", "action": "draw", "from": (x, y), "to": (x, y)}

Later if we want, we can add more actions (such as "erase"),
and more types of information.
But for now this should be enough for us to start,
so the message format looks okay.

### basic client messages ###

In any case the design team has gotten back to us,
and they say we can just put the message in the middle of the screen in stead.
They also added a text input box at the bottom of the screen.
They must have known what we were thinking!
Now the body of our `index.html` looks like this:

    <div id="origin">
        <div id="viewport"></div>
        <div id="textbox"></div>
        <form onsubmit="submit_message();">
            <input type="text" id="typebox" placeholder="type here">
        </form>
    </div>

our `index.css` has another item at the end:

    #typebox {
        position: absolute;
        bottom: -49vmin;
        left: -40vmin;
        width: 80vmin;
        text-align: center;
    }

our `index.js` has an extra function:

    function submit_message() {
        var typebox = document.getElementById('typebox');
        var message = JSON.stringify({"message": typebox.value});
        server.send(message);
        typebox.value = "";
    }

and there's another `else if` in `server.onmessage`:

        if (m.popup) {
            alert(m.popup);
        } else if (m.message) {
            document.getElementById('textbox').innerHTML = m.message;
        }

How mysterious.

### basic echo server ###

Let's deal with this new and wonderful message on our server,
by echoing it back to the client.

First in our `on_message()` method,
we'll have to parse the JSON to get the message.
We can add it just after the debug line printing the message to the console.

        # print the message to the console
        print("client sent: {!r}".format(message))
        
        # try to parse the message
        try:
            parsed_message = json.loads(message)
        except ValueError:
            print("Failed to parse message: {!r}".format(message))
            return

Here if we fail to parse the message we just return,
but we could equally close the connection with an error code such as 1003.

Assuming we parsed the message successfully,
we can change our response to echo back to the client.

        # if there's a "message" in the message, echo it
        if "message" in parsed_message:
            response = {
                "client" : str(self.request.remote_ip),
                "message" : parsed_message["message"]
            }
            # respond to the message
            m = json.dumps(response)
            self.write_message(m)
        else:
            print("message unhandled.")

This is very similar to the code we already had,
except for the client name we use the IP address of the client,
and for the message we echo the message they sent.
For debugging purposes,
we print a message to the console if the client's message was not handled.

### test it ###

The first thing we should notice when we refresh our client page,
is that it now says "Hello, server!".
That's the message from the client!
Looks like it works :).

Verify that typing messages in the box echoes them back,
and that they're displayed correctly in the middle of the viewport.


Step 7: Multi-user Communication
================================

In fact, as it is,
our server should already accept connections from multiple users.
It's just that the connections only echo back to themselves.

Perhaps we can enhance this easily by keeping a list of connections,
and echoing to all of them?
Let's try.

### messaging multiple users ###

At the top of our `server.py`,
add something to keep track of our connections.
In this case it is a set, but really it could be pretty much anything.

    # keep track of connected clients
    client_connections = set()

Now when a connection is opened it should be added to this set,
which we can do neatly in our `ClientSocket.open()` method.

        # add this connection to the set of active connections
        client_connections.add(self)

Similary when the connection closes,
it should be removed in `ClientSocket.on_close()`:

        # remove this connection from the set of active connections
        client_connections.remove(self)

Now when we echo a message back to a client,
in stead of just sending the message to them
let's send it to everyone.

Replace

            self.write_message(m)

with

            for connection in client_connections:
                connection.write_message(m)
            print("messaged {} clients".format(len(client_connections)))

### test it ###

We can test this on our own machines by opening two web browsers.

We should also be able to test it by connecting to our machine
from another computer on the local network.

The message should be echoed to every connected client,
and the server should display the number of messages it sent.

### adding colour, names, and multiple message display ###

It's not very pretty, though.
And it still doesn't say who sent what message,
or keep more than one message on the screen at once.

As we're already sending a client id,
the second of these is easily fixed by prefixing the message with the sender.

In `index.js` we can replace

        document.getElementById('textbox').innerHTML = m.message;

with

        var text = m.client + ": " + m.message
        document.getElementById('textbox').innerHTML = text;

In fact we can go ahead and display more than one message this way as well,
by appending a line-break and the new text,
in stead of replacing it outright.

        var text = m.client + ": " + m.message
        document.getElementById('textbox').innerHTML += "<br>" + text;

Now there's only prettiness...
well, let's add some colour.

We can assign a random colour to each client,
and display their messages using that colour.
Let's assign it in the server,
and send it with the message.

In `server.py`, import random

    import random

add some colour spice to `ClientSocket.open()`

        # assign a random not-too-light colour
        self.color = '#'
        for i in range(3):
            self.color += hex(random.randint(0,13))[2:]

modify our `ClientSocket.on_message()` response to include it

            response = {
                "client" : str(self.request.remote_ip),
                "color" : self.color,
                "message" : parsed_message["message"]
            }

and modify our `index.js` again to use the colour.

        var text = m.client + ": " + m.message
        text = '<span style="color:' + m.color + '">' + text + "</span>"
        document.getElementById('textbox').innerHTML += "<br>" + text;

### misc client improvements ###

As we're fousing on the Python side
we can ignore all the miscellaneous improvements that go into the client UI.
This separation of logic and UI leads to an efficient distribution of labour,
with server team and client team both able to work in parallel.
It also means that if you don't know javascript,
or your web designer friend doesn't know Python,
you can productively work together as a duo to create something great.

Of course, if you like both Python and web design
then you can work on both sides at once.
But even then it's nice to be able to cleanly distribute the work later,
when your idea turns out to be wildly successful and workload increases.

Here we can assume that while we were adding the random colour functionality,
our design team updated our `index.css`,
rewriting `#textbox` and `#typebox`, and adding a new `#textarea` tag:

    #textarea{
        position: absolute;
        width: 100vmin;
        bottom: -49vmin;
        left: -50vmin;
    }
    #textbox {
        width: 100%;
        margin-bottom: 0.3em;
        text-align: center;
        padding-top: auto;
    }
    #typebox {
        width: 80%;
        margin-left: 10%;
        margin-right: 10%;
        text-align: center;
    }

which goes with an update to `index.html`, which now looks like:

    <div id="origin">
        <div id="viewport"></div>
        <div id="textarea">
            <div id="textbox"></div>
            <form onsubmit="submit_message(); return false;">
                <input type="text" id="typebox" autofocus="true"
                    placeholder="type your message here">
            </form>
        </div>
    </div>

### set your name ###

This should work pretty well as is, but there's one last thing to do:
allow clients to set their name.

There are various ways this could be done,
but for now because it's easy let's add a special command
that can be typed into the chat box.

    /nick <myname>

We can do it pretty simply by setting a default nickname in `open()`:

        # assign a nickname
        self.nickname = str(self.request.remote_ip)

and analyzing the message in `on_message()`:

        if "message" in parsed_message:
            if parsed_message["message"].startswith("/nick "):
                self.nickname = parsed_message["message"].split()[1]
                return
            response = {
                "client" : self.nickname,
                "color" : self.color,
                "message" : parsed_message["message"]
            }

Here the new response message now includes the nickname,
which will default to the client IP address, as before.

### test it all again ###

We should now have a fully-functional realtime chat app,
accepting an arbitrary number of connections,
and even allowing a slash-command to change our nickname.
Nice.


Step 8: Other message types
===========================

Now that we have a chat app,
let's move on to our second core function:
being able to draw.

On our server side there's not much to do.
We need to detect when somebody clicks and drags on the viewport,
which is purely client code.

We need to parse the drag message,
and tell all clients to draw.
Here we can just add an "elif" statement
after our `if "message" in parsed_message:` block

        elif parsed_message.get("action", None) == "drag":
            # send a "drawline" action to everyone
            response = {
                "client" : self.nickname,
                "color" : self.color,
                "action" : "drawline",
                "from" : parsed_message["from"],
                "to" : parsed_message["to"]
            }
            m = json.dumps(response)
            for connection in client_connections:
                connection.write_message(m)
            print("messaged {} clients".format(len(client_connections)))

At this point we could do some code cleanup and refactoring,
split out the message handler,
create a function for sending response objects to all clients,
and so on.

As it is, however, this should be enough to fully support shared drawing.

### client ###

Sure enough, after we implement the additions in our server
our design team comes up with a modified `index.html`

    <div id="origin">
        <div id="clickbox"></div>
        <canvas id="viewport" width=1000 height=1000></canvas>
        <div id="textarea">
            <div id="textbox"></div>
            <form onsubmit="submit_message(); return false;">
                <input type="text" id="typebox" autofocus="true"
                    placeholder="type your message here">
            </form>
        </div>
    </div>

an added tag to `index.css`

    #clickbox {
        z-index: 3;
        width: 100vmin;
        height: 100vmin;
        position: absolute;
        top: -50vmin;
        left: -50vmin;
        background-color: none;
    }

and a whole bunch of added javascript.
I won't paste the updated javascript here,
but it should be able to be found in the "8" subfolder of this repository.
The key part that relates to what we've already seen
is a block to handle drawing lines when recieving a "drawline" message:

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

The rest of the added code is for handling mouse clicks,
and determining the correct coordinates to send for "from" and "to".

If you've already customized your javascript,
you can cut and paste the extra code from `8/client/index.js`.

### try it all out ###

At this point getting things to work will probably take some testing.
But when all goes well,
we should have a fancy shared multi-user webapp,
allowing many users to connect, chat and draw together in realtime.


Step 9: Whatever you imagine
============================

After this,
whatever your app does is just a matter of imagination and persistence.

Here our server doesn't do much except for forward messages,
but it's easy to imagine the server sending messages itself,
doing processing in the background,
keeping track of state for users that just connected,
and many other things.

We haven't relly even scratched the surface of what Tornado can do,
and i highly recommend checking out the user guide at
http://www.tornadoweb.org/en/stable/guide.html .
In particular we haven't talked about Tornado's great concurrency features,
which fit in really nicely with some of the latest improvements in Python.
It is definitely much more than a web server and message bus.

I hope you enjoyed this talk as much as i enjoyed writing it,
and i hope to see your awesome apps online in the future :).


--- Thomas Iorns

