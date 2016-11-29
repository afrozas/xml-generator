var spawn = require('child_process').spawn,
    py    = spawn('python', ['rss-generator.py']);


py.stdout.on('data', function(data){
  dataString += data.toString();
});

py.stdout.on('end', function(){
  console.log('Ends with = '+dataString);
});

var query = process.argv[2];
var dataString = '';
py.stdin.write(JSON.stringify(query));
py.stdin.end();