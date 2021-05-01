// Catapult Connector interface
// Author Cheikh Seck
class Catapult {
    constructor() {

    	// List of methods a connector must have.
    	// Additional verbs can be saved, add them to the list below
    	// to enforce it.
        var methods = ["setModel", "add", "delete", "put", "get", "getAll"]

        for (var i = methods.length - 1; i >= 0; i--) {
            var m = methods[i];
            if (!this[m]) {
            	var message = "Invalid connector supplied : " + this.getErrorMessage(m)
                throw new Error(message)
            }
        }

    }


    getErrorMessage(method) {
    	var message

        switch (method) {
        	case "setModel":
        		message = "setModel(model) is required. This function must return the data model's collection/endpoint name"
        	break;
        	case "add":
        		message = "add(params) is required. This function is used to add a new object to your database"
        	break;
        	case "delete":
        		message = "delete(params) is required. This function is used to remove an object from your database"
        	break;
        	case "put":
        		message = "put(params) is required. This function used to update an object in your database"
        	break;
        	case "get":
        		message = "get(params) is required. THis function is used to get a specific object, via a unique key from your database"
        	break;
        	case "getAll":
        		message = "getAll(params) is required. Retrieves an object list."
        	break;
            default:

            break;
        }

        return message
    }
}

module.exports = Catapult