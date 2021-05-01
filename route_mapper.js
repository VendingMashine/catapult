var express = require('express')
let bodyParser = require('body-parser');

class RouteMapper {


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

    getRouter(){
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
            id: req.params.id,
            post: req.body,
            query: req.query
        }
    }

    map(model) {
        var connector = new this.connector()

        var apiName = connector.setModel(model)

        // Handle all requests towards api
        this.router.route(`/${apiName}/:id`)
            .all(async (req, res, next) => {

                try {

                    // Pass request verb as method name, in lowercase
                    var verb = req.method.toLowerCase()
                    var params = this.params(req)

                    var result = await connector[verb](params)

                    return res.json(result)

                } catch (e) {
                    // pass error to next handler
                    next(e)
                }
            })

        this.router.route(`/${apiName}`)
            .get(async (req, res, next) => {

                try {
                    var params = this.params(req)
                    var results = await connector.getAll(params)
                    return res.json(results)

                } catch (e) {
                    next(e)
                }
            })
            .post(async (req, res, next) => {

                try {
                    var params = this.params(req)
                    var result = await connector.add(params)
                    return res.json(result)

                } catch (e) {
                    next(e)
                }
            })
    }
}

module.exports = RouteMapper;