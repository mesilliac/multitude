#!/usr/bin/python
# coding: utf-8
"""A simple webserver."""

# python 2.7 compatibility
from __future__ import print_function, unicode_literals

# based on tornado
import tornado.ioloop
import tornado.web
import tornado.websocket

import sys

def make_app():
    """Create and return the main Tornado web application.
    
    It will listen on the port assigned via `app.listen(port)`,
    and will run on Tornado's main ioloop,
    which can be started with `tornado.ioloop.IOLoop.current().start()`.
    """
    return tornado.web.Application([
        (r"/connect", ClientSocket),
        (r"/(.*)", tornado.web.StaticFileHandler, {
            "path": "client",
            "default_filename": "index.html"
        }),
    ], debug=True)

class ClientSocket(tornado.websocket.WebSocketHandler):
    """ClientSocket represents an active websocket connection to a client.
    """
    
    def open(self):
        """Called when a websocket connection is initiated."""
        
        # print some info about the opened connection
        localename = self.get_browser_locale().name
        ipaddr = self.request.remote_ip
        print("WebSocket opened",
              "from user at {}".format(ipaddr),
              "with locale {!r}".format(localename))
    
    def on_message(self, message):
        """Called when a websocket client sends a message."""
        
        # print the message to the console
        print("client sent: {!r}".format(message))
        
        # respond to the message
        self.write_message("Hello, client!")
    
    def on_close(self):
        """Called when a client connection is closed for any reason."""
        
        # print some info about the closed connection
        localename = self.get_browser_locale().name
        ipaddr = self.request.remote_ip
        print("WebSocket closed",
              "by user at {}".format(ipaddr),
              "with locale {!r}".format(localename))
        print("close code: {}".format(self.close_code), end=", ")
        print("close reason: {!r}".format(self.close_reason))

if __name__ == "__main__":
    # print some basic info about the system
    print("Running Tornado Web Server {}".format(tornado.version))
    print("Using Python {}".format(sys.version))
    
    # start the webapp on port 8888
    app = make_app()
    app.listen(8888)
    print("webapp started on port 8888")
    tornado.ioloop.IOLoop.current().start()
