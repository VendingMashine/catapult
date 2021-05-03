var Service = require("./service")

class COORs extends Service {

    constructor() {
    	super()
    }

    // API resource name.
    // Null returned in this instance
    // to use the service as 
    // middleware.
    getName() {
        return null
    }


    // Method option declared to handle incoming requests
    // with verb option.
    options(params) {
    	let res = params.res

    	// Set request origin. Asterisk used to denote any
    	// origin.
        res.header('Access-Control-Allow-Origin', '*')

        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        return
    }
}

module.exports = COORs