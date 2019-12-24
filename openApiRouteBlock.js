function typeOf(t){return null===t||void 0===t?String(t):class2type[Object.prototype.toString.call(t)]||"object"}function isEmpty(t){var e,r;if("object"===typeOf(t))for(e in t)if(r=t[e],void 0!==r&&"function"!==typeOf(r))return!1;return!0}function stringify(t){var e,r="";return e={undefined:function(){return"null"},null:function(){return"null"},number:function(t){return t},boolean:function(t){return t?"true":"false"},string:function(t){return JSON.stringify(t)},array:function(t){var n="";return 0===t.length?n+="[]":(r=r.replace(/$/,"  "),t.forEach(function(t){var o=e[typeOf(t)];if(!o)throw new Error("what the crap: "+typeOf(t));n+="\n"+r+"- "+o(t)}),r=r.replace(/  /,""),n)},object:function(t){var n="";return 0===Object.keys(t).length?n+="{}":(r=r.replace(/$/,"  "),Object.keys(t).forEach(function(o){var i=t[o],a=e[typeOf(i)];if("undefined"!=typeof i){if(!a)throw new Error("what the crap: "+typeOf(i));n+="\n"+r+o+": "+a(i)}}),r=r.replace(/  /,""),n)},function:function(){return"[object Function]"}},"---"+e[typeOf(t)](t)+"\n"}var global=Function("return this")(),classes="Boolean Number String Function Array Date RegExp Object".split(" "),i,name,class2type={};for(i in classes)classes.hasOwnProperty(i)&&(name=classes[i],class2type["[object "+name+"]"]=name.toLowerCase());String.prototype.entityify||(String.prototype.entityify=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}),String.prototype.quote||(String.prototype.quote=function(){var t,e,r=this.length,n='"';for(e=0;e<r;e+=1)if(t=this.charAt(e),t>=" ")"\\"!==t&&'"'!==t||(n+="\\"),n+=t;else switch(t){case"\b":n+="\\b";break;case"\f":n+="\\f";break;case"\n":n+="\\n";break;case"\r":n+="\\r";break;case"\t":n+="\\t";break;default:t=t.charCodeAt(),n+="\\u00"+Math.floor(t/16).toString(16)+(t%16).toString(16)}return n+'"'}),String.prototype.supplant||(String.prototype.supplant=function(t){return this.replace(/{([^{}]*)}/g,function(e,r){var n=t[r];return"string"==typeof n||"number"==typeof n?n:e})}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/,"$1")}),global.typeOf=global.typeOf||typeOf,global.isEmpty=global.isEmpty||isEmpty;

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
                        },
                        {
                            "in": "header",
                            "name": "X-Scope",
                            "schema": {
                                "type": "string" 
                            },
                            "required": true
                        },
                        {
                            "in": "header",
                            "name": "X-Org",
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
                        },
                        {
                            "in": "header",
                            "name": "X-Scope",
                            "schema": {
                                "type": "string" 
                            },
                            "required": true
                        },
                        {
                            "in": "header",
                            "name": "X-Org",
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

        routeBlock[route]['post']['requestBody']['content']['application/json']['schema'] = {type : typeOf(parsedBody), ...jsonSchema}

    }

    
    return routeBlock;
}