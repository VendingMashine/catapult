var express = require('express')
let bodyParser = require('body-parser');

// This generates an Express router with the supplied
// connector and models.
class RouteMapper {

    // Param c is required, it defines the database connector
    constructor(c, bodyParserParams = { limit: "5mb" }) {

        this.router = express.Router()
        // Allow JSON data to be submitted to router
        // Disabled if parameter passed is null
        if (bodyParserParams != null) {
            this.router.use(bodyParser.json(bodyParserParams));
        }
        // Set data connector, must have desired http verbs
        this.connector = c
    }

    // Returns router
    getRouter() {
        return this.router;
    }

    // Add endpoints to express router.
    // objects passed must be compatible
    // with the connector.
    add(...models) {

        for (var i = models.length - 1; i >= 0; i--) {
            var m = models[i]
            this.map(m)
        }
    }

    params(req) {
        return {
            // Id passed of object
            // if applicable
            id: req.params.id,
            // JSON data passed
            post: req.body,
            query: req.query
        }
    }


    // Abstracts express request handling
    async handle(connector, method, req, res, next) {
        try {
            let params = this.params(req)
            var results = await connector[method](params)
            return res.json(results)

        } catch (e) {
            next(e)
        }
    }

    map(model) {
        let connector = new this.connector()
        // set the model and return resource name
        // to be used in path
        var apiName = connector.setModel(model)

        // Handle all requests towards api,
        // the request verb passed is used as the 
        // class method
        this.router.route(`/${apiName}/:id`)
            .all(async (req, res, next) => {
                var verb = req.method.toLowerCase()
                return this.handle(connector, verb, req, res, next)
            })

        this.router.route(`/${apiName}`)
            .get(async (req, res, next) => {
                return this.handle(connector, "getAll", req, res, next)
            })
            .post(async (req, res, next) => {
                return this.handle(connector, "add", req, res, next)
            })
    }
}

module.exports = RouteMapper;