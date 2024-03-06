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






// CONTROLLER 
const controllers = ['Routes'];
for(var i=0; i<controllers.length; i++){
  const controller = require('./controllers/'+controllers[i]);
  controller.add(server);
}








const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
