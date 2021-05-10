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

var sampleGroup = [{ name: 'john' }, { name: 'tom' }]
var tm = new TeazingModel()

RouteMapper.add(tm)
var router = RouteMapper.getRouter()

app.use("/", router)

describe('POST /teazers', function() {

    it('responds with json, should save request to db', function(done) {
        request(app)
            .post('/teazers')
            .send(sampleGroup[0])
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                delete res.body._id
                delete res.body.createdAt
            })
            .expect(200, {
                name: 'john'
            }, done);
    });

    it('should add new items in bulk', function(done) {
        request(app)
            .post('/teazers')
            .send(sampleGroup)
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
            .expect(function(res) {
                delete res.body._id
                delete res.body.createdAt
            })
            .expect(200, {
                name: 'john'
            }, done);
    });

});

describe('DELETE /teazers/:id', function() {

    it('responds with json', function(done) {
        request(app)
            .delete('/teazers/query?name=john')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {}, done)
    });

});


describe('PUT /teazers/:id', function() {

    it('responds with json', function(done) {
        request(app)
            .put('/teazers/query?name=john')
            .send({ update : "field" })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {}, done)
    });

});
