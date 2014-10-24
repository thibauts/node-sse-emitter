sse-emitter
===========
### Server-Sent Events as simple as they can get

Bind an instance to a route and emit events named after the matched path.

For example, if you bind to route `/hello`, when you emit event `/hello`, browsers listening on this endpoint will get the event data.

If you bind to route `/hello/:name`, you can send messages to browsers having `EventSource('/hello/world')` and `EventSource('/hello/sse')` by emitting respectively `/hello/world` and `/hello/sse` events. This makes implementing chatroom-like or channel-like functionnality a breeze. See usage.

Of course a single emitter can be bound to as many routes as you like. Also, the `bind` method returns a simple handler and doesn't prevent you from adding middleware, eg. for authentication.

Installation
------------

```bash
$ npm install sse-emitter
```

Usage
-----

```javascript
var express = require('express');
var SSE = require('sse-emitter');

var sse = new SSE();
var app = express();

app.get('/channel/:id', sse.bind());

app.listen(5000);

setInterval(function() {
  sse.emit('/channel/1', {
    text: "Hello, SSE !"
  });
}, 1000);

```

Then browser-side :

```javascript
var channel = new EventSource('/channel/1');
channel.addEventListener('message', function(ev) {
  console.log(JSON.parse(ev.data));
});
```
