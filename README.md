A server for multi-user real-time webapps, using Python and Tornado.


Tornado Web Server
==================

Tornado is a python webserver for high-speed asynchronous networking.

http://www.tornadoweb.org


Documentation
-------------

In this talk we will primarily be making use of:

* the basic tornado web framework, tornado.web:
  http://www.tornadoweb.org/en/stable/web.html

* websockets! tornado.websocket:
  http://www.tornadoweb.org/en/stable/websocket.html

* the main tornado IO loop, tornado.ioloop:
  http://www.tornadoweb.org/en/stable/ioloop.html


Installation
------------

You can install tornado from PyPI using "pip"

    pip install tornado

or for Python 3:

    pip3 install tornado

Alternatively your package management system may have it,
for example in Ubuntu 16.04 it can be installed via "apt":

    sudo apt install python-tornado (Python 2)
    sudo apt install python3-tornado (Python 3)


Javascript
==========

The client-side part of our code will be mostly written using
HTML5, CSS, and Javascript.

Full client code is provided for each step,
so knowledge of these languages is not necessary for this talk.


Repository Structure
====================

Full example code for each stage of the talk is given in numbered directories,
"0", "1", "2", etc.

Each directory contains:

* server.py - the main python webserver
* client/index.html - the browser-based client
* client/* - any other resources used by the client


Running and connecting to the Webapp
====================================

The webapp can be run by starting `server.py`.
It will listen on port `8888` by default,
but this can easily be changed.

Once the server is running,
connect to `localhost:8888` using your favourite web browser.

In order for websockets to work when testing on your local machine,
some browser security features may need to be disabled.

To connect to someone else's app on your local network,
some operating system security features may need to be disabled.



Copyright
=========

All code and assets included in this repository
are released under the CC0 (Creatve Commons Zero) license.

You can do anything you want with them.

For more details see the license text at:
https://creativecommons.org/publicdomain/zero/1.0/

