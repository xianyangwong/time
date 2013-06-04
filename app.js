// Generated by CoffeeScript 1.6.2
(function() {
  var app, express, io, port;

  express = require('express');

  app = express();

  port = 80;

  app.use(express["static"](__dirname + '/public'));

  app.set('views', __dirname + '/tpl');

  app.set('view engine', 'jade');

  app.engine('jade', require('jade').__express);

  app.get('/', function(req, res) {
    return res.render('page');
  });

  app.get('/works', function(req, res) {
    console.dir(req.headers);
    return res.send('Works');
  });

  io = require('socket.io').listen(app.listen(port));

  io.sockets.on('connection', function(socket) {
    var clock, d;

    console.log('client connected ');
    console.log(socket.id);
    d = new Date();
    clock = d.toLocaleTimeString();
    socket.emit('message', {
      message: 'welcome to the chat ' + clock
    });
    return socket.on('send', function(data) {
      return io.sockets.emit('message', data);
    });
  });

  console.log("Listening on port " + port);

}).call(this);

/*
//@ sourceMappingURL=app.map
*/