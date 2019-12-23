const express = require('express');
const path = require('path');
const logger = require('morgan');
const writeChangestoSpecFile = require('./fileWrite.js')
const cors = require('cors')
let openApiSpecOrch = require('./orchestratorOpenApi.json')
const OpenApiRouteBlock = require('./openApiRouteBlock.js')
const swaggerUi = require('swagger-ui-express');


const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
process.env['EXTEND_SPEC'] = 'YES'

const app = express();

app.use(cors());
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecOrch));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

if(process.env['EXTEND_SPEC'] === 'YES') {
  app.post('/create-spec', (req, res) => {
    console.log('asdasdasdasd');
    var newRoute = '/' + req.body.url.join('/').toLowerCase();
  
    var requestBlock = {}
  
    if (!openApiSpecOrch['paths'][newRoute]) {
      requestBlock = OpenApiRouteBlock(newRoute, req.body.reqBody);
      console.log(requestBlock);
      openApiSpecOrch.paths[Object.keys(requestBlock)[0]] = requestBlock[Object.keys(requestBlock)[0]];
      console.log("openApiSpecOrch", openApiSpecOrch);
      writeChangestoSpecFile(requestBlock, openApiSpecOrch)
      res.json({status : 'route added to specification'})
    }
    else {
      console.log('here comes here')
      res.json({status : 'route exist'})
    }
  })
}


new OpenApiValidator({
  apiSpec: './orchestratorOpenApi.json',
  validateRequests: true,
  validateResponses: false
}).install(app).then(() => {

  app.post('/:class/?:method', (req, res) => {
    res.json({ status: res })
  })
  app.get('/:class/?:method', (req, res) => {
    console.log(req.params)
    res.json({ id: req.params.id, name: 'sparky' })
  })

  app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

})



module.exports = app;
