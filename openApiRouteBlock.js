const schemaCreator = require('./schemaCreator.js');


module.exports = (route, body) => {
    const parsedBody = body
    let routeBlock = {}
    if (Object.keys(parsedBody).length === 0) {
        //Request is GET.
        routeBlock = {
            [route]: {
                'get': {
                    "parameters": [
                        {
                            "in": "header",
                            "name": "X-Auth-Token",
                            "schema": {
                                "type": "string"
                                
                            },
                            "required": true
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Response",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        //Request is POST.

        routeBlock = {
            [route]: {
                'post': {
                    "parameters": [
                        {
                            "in": "header",
                            "name": "X-Auth-Token",
                            "schema": {
                                "type": "string"
                                
                            },
                            "required": true
                        }
                    ],
                    'requestBody': {
                        'required': true,
                        'content': {
                            'application/json': {
                                'schema': {

                                }
                            }
                        }

                    }, 'responses': {
                        '201': {
                            'description': 'Just a description'
                        }
                    }
                }
            }
        }


        //Sending request.body to get proper json schema.


        const jsonSchema = schemaCreator(parsedBody)

        //Appending newly created json schema to request body.

        routeBlock[route]['post']['requestBody']['content']['application/json']['schema'] = {type : 'object', ...jsonSchema}






    }
    return routeBlock;
}