class Service {

	constructor() {

    	// List of methods a connector must have.
    	// Additional verbs can be saved, add them to the list below
    	// to enforce it.
        var methods = ["getName"]

        for (var i = methods.length - 1; i >= 0; i--) {
            var m = methods[i];
            if (!this[m]) {
            	var message = "Invalid service class supplied : " + this.getErrorMessage(m)
                throw new Error(message)
            }
        }

    }


    getErrorMessage(method) {
    	var message

        switch (method) {
        	case "getName":
        		message = "method getName() is required. The value returned by this will be your services name"
        	break;
            default:
            	message = "Unknown"
            break;
        }

        return message
    }

}

module.exports = Service