var EventEmitter = require('events').EventEmitter;
var util = require('util');

var DEFAULT_KEEPALIVE = 10000; // 10 seconds

function SSE(options) {
  EventEmitter.call(this);

  options = options || {};
  this.keepAlive = options.keepAlive || DEFAULT_KEEPALIVE;
  this.encoder = options.encoder || JSON.stringify;
}

util.inherits(SSE, EventEmitter);

SSE.prototype.bind = function() {
  var self = this;
  return function(req, res) {

    var s = req.socket;
    s.setTimeout(0); // never timeout
    s.setKeepAlive(self.keepAlive); // prevent the other end or intermediaries to drop the connection

    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');
    res.header('Connection', 'keep-alive');

    var id = 0;

    function onevent(data) {
      res.write('id: ' + id + '\n');
      res.write('data: ' + self.encoder(data) + '\n\n');
      id++;
    }

    var eventName = req.path;
    self.on(eventName, onevent);

    req.once('close', function() {
      self.removeListener(eventName, onevent);
    });
  };
};

module.exports = SSE;