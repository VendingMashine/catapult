const express = require('express')
const app = express()
const port = 3000

var catapult = require("../index")
// Load Mongoose models
var models = require("./models")
var coors = require("../services/coors")
var counter = require("../services/counter")

var RouteMapper = new catapult.RouteMapper(catapult.MongooseConnector)
var CoorService = new coors();
var CounterService = new counter()

RouteMapper.addService(CoorService, CounterService)
RouteMapper.add(models.Cat, models.Dog)
var router = RouteMapper.getRouter()

app.use("/",router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


