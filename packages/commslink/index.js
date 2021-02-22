const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(content));
  res.end(content);
});

var ping = require('ping');
var services = ['192.168.11.1'];

const io = require('socket.io')(httpServer);

function checkAliveness(){

    setTimeout(function(){

        services.forEach(function(service) {
            ping.sys.probe(service, function(isAlive) {

                var msg = isAlive ? 'service ' + service + ' is alive' : 'service ' + service + ' is dead';
                
                io.on('connection', socket => {
                    socket.emit('status', msg);
                  });
                  
                checkAliveness();

            })
        })

    }, 500)
};

checkAliveness();

httpServer.listen(3000);