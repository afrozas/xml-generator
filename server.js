var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');
var util = require('util');
var spawn = require('child_process').spawn;
var py    = spawn('python', ['rss-generator.py']);

py.stdout.on('data', function(data){
  dataString += data.toString();
});

py.stdout.on('end', function(){
  console.log('results stored in '+dataString);
});

var queries = []
var query = '';
var dataString = '';

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
});

io.sockets.on('connection', function(socket) {
    socket.on('query', function(data, callback) {		        
		if (queries.indexOf(data) == -1)
		{
			console.log("        querying -> " + data);
			queries.push(data);				
		    py.stdin.write(JSON.stringify(data));
			py.stdin.end();
			socket.emit('success',data);
		}
		else
		{
		    console.log(" already queried -> " + data);
		    socket.emit('exists',data);
		}
	});
});

http.listen(3333, function(){
  console.log('listening on *:3333');
});