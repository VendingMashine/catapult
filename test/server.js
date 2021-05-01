const express = require('express')
const app = express()
const port = 3000

var catapult = require("../index")
// Load Mongoose models
var models = require("./models")

var RouteMapper = new catapult.RouteMapper(catapult.MongooseConnector)

RouteMapper.add(models.Cat, models.Dog)
var router = RouteMapper.getRouter()

app.use("/",router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


