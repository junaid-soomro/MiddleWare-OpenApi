const express = require('express');
const logger = require('morgan');
const writeChangestoSpecFile = require('./fileWrite.js')
const cors = require('cors')
let openApiSpecOrch = require('./orchestratorOpenApi.json')
const OpenApiRouteBlock = require('./openApiRouteBlock.js')
const swaggerUi = require('swagger-ui-express');


const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
process.env['EXTEND_SPEC'] = 'YES'
const app = express();

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecOrch));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env['EXTEND_SPEC'] === 'YES') {
  app.post('/create-spec', (req, res) => {
    
    var newRoute = '/' + req.body.url.join('/').toLowerCase();
    var requestBlock = {}
  
    //checks if route does not exits
    //then writes to file
    if (!openApiSpecOrch['paths'][newRoute]) {
      requestBlock = OpenApiRouteBlock(newRoute, req.body.reqBody);
      const routePath = Object.keys(requestBlock)[0];
      openApiSpecOrch.paths[routePath] = requestBlock[routePath];
      writeChangestoSpecFile(openApiSpecOrch)
      res.json({status : 'route added to specification'})
    }
    else {
      res.json({status : 'route exist.'})
    }
  })
}

new OpenApiValidator({
  apiSpec: './orchestratorOpenApi.json',
  validateRequests: true,
  validateResponses: false
}).install(app).then(() => {

  app.post('/:class/?:method', (req, res) => {
    res.json({ "status": "working" })
  })
  app.get('/:class/?:method', (req, res) => {
    res.json({ id: req.params.id, name: 'sparky' })
  })

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

})

module.exports = app;
