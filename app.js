var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs') 
const schemaCreator = require('./schemaCreator.js')


var OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//app.use('/', indexRouter);
//app.use('/users', usersRouter);
const spec = path.join(__dirname,'/public/compute_spec.json')
app.use('/spec',express.static(spec))

app.post('/abc', (req, res) => {

  var finalURL = req.originalUrl;
  var bashirSchema = {[finalURL] : {
    'post' : {
    'summary' : 'Just a summary',
    'requestBody' : {   
  
    },'responses':{
      '201' : {
        'description' : 'Just a description'
      }
    }
  }
  }}
  //default path with request body for post.
  //Sending request.body to get proper json schema.
  var jsonSchema = schemaCreator(req.body)
  //Appending newly created json schema to request body.
  bashirSchema[finalURL]['post']['requestBody'] = jsonSchema 

  res.send(jsonSchema)
  var existingSpecFile = fs.readFileSync('compute_spec.json')
  
  var existingJson = [JSON.parse(existingSpecFile)]
 
  var keys = Object.keys(existingJson[0]['paths'])
  
  keys.forEach(function(x){
    if(finalURL === x){

      console.log('exists',x)
      res.send({status : 'Route already exists'})
    }
  });
  
  
  existingJson.push(bashirSchema)
  //fs.writeFile("compute_spec.json", JSON.stringify(newJson))
  console.log('json',existingJson)
  res.send(existingJson)
  
})

new OpenApiValidator({
  apiSpec : './compute_spec.json',
  validateRequests : true,
  validateResponses:false
}).install(app).then(() => {

  app.post('/:class/?:method', (req, res) => {
    
      res.json({status : res})
  })
  app.get('/:class/?:method', (req, res) => {
    console.log(req.params)
      res.json({id : req.params.id, name : 'sparky'})
  })

  app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

})





// error handler


module.exports = app;
