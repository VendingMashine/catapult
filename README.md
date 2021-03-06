
# catapult

Catapult is a Web API abstraction tool. The aim of this package is to simplify adding data endpoints to a NodeJS application/server. The generated API endpoints follow RFC 7231. Here is a quick guide of how this works :

For the following example to work, you must have MongoDB running.

### Import package

	var catapult = require("catapult_edm")


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
	
	// resource name will be `cats`
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

Mount a path for your new endpoints 

	app.use("/",router)


### Web Interface

Once the route mapper is configured and linked to your express server, you can access your data with the following request combinations. Keep in mind that `<model name>` is the API resource name your data connector returns. The table below will assume that your router is mounted at server root. In Mongoose land, `<object id>` is the string representation of field `_id` within your MongoDB object.

|Request Verb | Registered Express Path | Request Body| Result |
|--|--| --| --|
| POST | `/<model name>`  | JSON string of object to add. `{ "name" : "Fluffo" }` with the models defined above in mind | Newly created object. As a json string. Submit an Array to bulk insert items. ie : `[{ "name" : "Fluffo"}]` |
| GET  | `/<model name>?query=val` | N/A | A list of objects. Query parameters are optional, but can be used to filter results based on a passed string value.
| PUT  | `/<model name>/<object id>`  | JSON string with object updates | JSON object with success message.
| GET  | `/<model name>/<object id>` | N/A | JSON object with the ID of the requested object. `null` is returned if the object is not found.
| GET  | `/<model name>/find?query=val` | N/A | Find an individual record based on query supplied.
| DELETE  | `/<model name>/<object id>` | N/A | JSON object with success message, otherwise `null`


Sample commands  with curl:

Get all cats :

	curl -XGET 'http://localhost:3000/cats'

Add a new cat record :

	curl -XPOST -H "Content-type: application/json" -d '{ "name" : "Fluffo" }' 'http://localhost:3000/cats'

Update a cat record :

	curl -XPUT -H "Content-type: application/json" -d '{ "name" : "Fluff" }' 'http://localhost:3000/cats/608d41ca30f954cbf1d11170'

