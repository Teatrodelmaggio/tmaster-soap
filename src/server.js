const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

//import apiRouter from './Routes/apiRouter';
import buUserRouter from './Routes/Bu'
import eventRouter from './Routes/Event'
import seanceRouter from './Routes/Seance'

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Handles any requests that don't match the ones above
//app.use('/api', apiRouter);
app.use('/bu', buUserRouter);
app.use('/event', eventRouter);
app.use('/seance', seanceRouter);
app.get('/test', (req,res) => {
    var response = {test:'test'}
  res.json(response);
});


app.get('*', (req,res) =>{
  res.json({mytest:'works'})
    //res.sendFile(path.join(__dirname+'/../../client/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);