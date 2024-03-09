//npm init
//npm i express express-handlebars body-parser mongodb
// Pls see comment regarding new codes.

const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));


const Handlebars = require('handlebars');

Handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 1; i <= n; ++i)
      accum += block.fn(i);
  return accum;
});


// Register the nested loop helper
Handlebars.registerHelper('nestedLoop', function(count, options) {
  var ret = "";

  // Validate input
  if (typeof count !== 'number' || count < 0) {
      throw new Error("Invalid input: Count must be a non-negative number");
  }

  // Outer loop
  for (var i = 1; i <= count; i++) {
      // Pass outer loop index to inner loop
      ret += options.fn({ outerIndex: i });
  }

  return ret;
});


// CONTROLLER 
const controllers = ['Routes'];
for(var i=0; i<controllers.length; i++){
  const controller = require('./controllers/'+controllers[i]);
  controller.add(server);
}








const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
