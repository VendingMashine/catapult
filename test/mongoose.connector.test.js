const assert = require('assert');
const request = require('supertest');

const express = require('express')
const app = express()

var catapult = require("../index")
// Load Mongoose models
var TeazingModel = require("./teazer")

var RouteMapper = new catapult.RouteMapper(
    catapult.MongooseConnector
)


RouteMapper.add(new TeazingModel())
var router = RouteMapper.getRouter()

app.use("/", router)

describe('POST /teazers', function() {

    it('responds with json, should save request to db', function(done) {
        request(app)
            .post('/teazers')
            .send({ name: 'john' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                assert(response.body.name, 'john')

                if (!response.body._id) {
                    throw "Failed "
                }

                done();
            })
            .catch(err => done(err))
    });

    it('should add new items in bulk', function(done) {
        request(app)
            .post('/teazers')
            .send([{ name: 'john' }, { name: 'tom' }])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {


                done();
            })
            .catch(err => done(err))
    });

});


describe('GET /teazers', function() {

    it('responds with json', function(done) {
        request(app)
            .get('/teazers')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {

                done();
            })
            .catch(err => done(err))
    });

    it('queries one result, and responds with json', function(done) {
        request(app)
            .get('/teazers/query?name=john')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

});