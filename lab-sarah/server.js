'use strict';

//node modules
const url = require('url');
const http = require('http');
const queryString = require('querystring');

//npm modules
const cowsay = require('cowsay');

//module constants
const PORT = process.env.PORT || 3000;

const parseBody = require('./lib/parse-body.js');

//module logic
const server = http.createServer(function(req, res) {
  // console.log('BEGINNING', res, 'END OF RESPONSE');
  req.url = url.parse(req.url);
  req.url.query = queryString.parse(req.url.query);

  if(req.url.pathname ==='/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('hello world');
    res.end();
    return;
  }

  if(req.method === 'GET' && req.url.pathname === '/cowsay') {

    if (req.url.query.text) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      //respond with a body including the value returned from the cowsay.say
      //basically what the person typed into the query
      var cowText = req.url.query.text;
      res.write(cowsay.say({text: cowText}));
      res.end();
    } else {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end();
    }
    return;
  }

//post sends a request to the server with a BODY of the CONTENT of what it wants the server to process
  if(req.method === 'POST' && req.url.pathname === '/cowsay') {
    parseBody(req, function(err) {
      if (err) return console.error(err);
      if (req.body.text) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(cowsay.say({text: req.body.text}));
        res.end();
      } else {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write(cowsay.say({text: 'bad request/entry: localhost:3000/cowsay?text=howdy'}));
        res.end();
      }
    });
    return;
  }

  //catchall to check for incorrect routes
  res.statusCode = 404;
  res.write(cowsay.say({text: 'Invalid route. Try again.'}));
  res.end();

});


server.listen(PORT, function() {
  console.log('server up on: ', PORT);
});
