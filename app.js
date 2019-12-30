process.env['EXTEND_SPEC'] = 'YES'


const express = require('express');
const logger = require('morgan');
const writeChangestoSpecFile = require('./fileWrite.js')
const cors = require('cors')
let openApiSpecOrch = require('./orchestratorOpenApi.json')
const OpenApiRouteBlock = require('./openApiRouteBlock.js')
const swaggerUi = require('swagger-ui-express');

// routers
const orchestrator = require('./routes/orchestrator');
const auth = require('./routes/auth');


const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpecOrch));

if (process.env['EXTEND_SPEC'] === 'YES') {
  app.post('/create-spec', (req, res) => {

    var newRoute = null;

    if (Array.isArray(req.body.url)) {
      newRoute = '/' + req.body.url.join('/').toLowerCase();
    } else {
      newRoute = req.body.url
    }


    var requestBlock = {}

    //checks if route does not exits
    //then writes to file
    if (!openApiSpecOrch['paths'][newRoute]) {
      requestBlock = OpenApiRouteBlock(newRoute, req.body.reqBody);
      const routePath = Object.keys(requestBlock)[0];
      openApiSpecOrch.paths[routePath] = requestBlock[routePath];
      writeChangestoSpecFile(openApiSpecOrch)
      res.json({ status: 'route added to specification' })
    }
    else {
      res.json({ status: 'route exist.' })
    }
  })
}

new OpenApiValidator({
  apiSpec: './orchestratorOpenApi.json',
  validateRequests: true,
  validateResponses: false
}).install(app).then(() => {

  app.use('/api/v1/auth', auth);
  app.use('/api/v1/service', orchestrator);


  app.use((req, res, next) => {
    next(new Error('route not found'));
  })


  app.use((err, req, res, next) => {
    try {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    } catch (e) {
      res.status(500).json({ ...e })
    }


  });


})



module.exports = app;
