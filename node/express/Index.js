var express = require('express');

var app = express();
var secret = 50;

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
});

app.get('/reset', function (req, res) {
    secret = Math.ceil(Math.random() * 100);
    console.log('The secret number is now ' + secret);
    res.send('reset');
});

app.get('/guess/:guess', function (req, res) {
   console.log('Got a guess: ' + req.params.guess);
   var guess = req.params.guess;

   if (guess < secret) {
       res.send('Too low.');
   }
   else if (guess > secret) {
       res.send('Too high.');
   }
   else {
       res.send('Correct!');
   }
});



var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)

})
