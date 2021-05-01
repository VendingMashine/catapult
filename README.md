
# catapult

Catapult is an Web API abstraction tool. The aim of this package is to simplify adding data endpoints to a NodeJS application/server. Here is a quick guide of how this works :

For the following example to work, you must have MongoDB running.

### Import package

	var catapult = require("catapult")


###  Setup Components

Initialize the RouteMapper and pass the Mongoose Connector provided with the package :

	var RouteMapper = new catapult.RouteMapper(
		catapult.MongooseConnector
	)

Now add a few Mongoose models to access through REST API

	const mongoose = require('mongoose');
	mongoose.connect(
	    'mongodb://localhost:27017/test', {
	        useNewUrlParser: true,
	        useUnifiedTopology: true
	    }
	);

	var Pet = { 
		name: String 
	}

	const Cat = mongoose.model('Cat', Pet );

	const Dog = mongoose.model('Dog', Pet );

	models = {
		Cat,
		Dog
	}

### Generate API

Add the models to the route mapper. 

	RouteMapper.add(models.Cat, models.Dog)
	var router = RouteMapper.getRouter()

Assign a route for your new endpoints 

	app.use("/",router)


See the full example under test/server.js within this repository.