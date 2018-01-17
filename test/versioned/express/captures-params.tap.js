'use strict'

// shut up, Express
process.env.NODE_ENV = 'test'

var test = require('tap').test
var helper = require('../../lib/agent_helper')


// CONSTANTS
var TEST_HOST = 'localhost'
var TEST_URL = 'http://' + TEST_HOST + ':'


test("test attributes.enabled for express", function(t) {
  t.autoend()

  t.test("no variables", function(t) {
    t.plan(5)
    var agent = helper.instrumentMockedAgent({
      express4: true,
      send_request_uri_attribute: true
    })
    var app = require('express')()
    var server = require('http').createServer(app)
    var port = null

    t.tearDown(function() {
      server.close()
      helper.unloadAgent(agent)
    })

    // set apdexT so apdex stats will be recorded
    agent.config.apdex_t = 1

    // set attributes.enabled so we get the data we need.
    agent.config.attributes.enabled = true

    app.get('/user/', function(req, res) {
      t.ok(agent.getTransaction(), "transaction is available")

      res.send({yep : true})
      res.end()
    })

    agent.on('transactionFinished', function(transaction) {
      t.ok(transaction.trace, 'transaction has a trace.')
      var attributes = transaction.trace.attributes.get('transaction_tracer')
      if (attributes.httpResponseMessage) {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "httpResponseMessage": "OK",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          'request.uri' : "/user/"
        }, 'attributes should only have request/response params')
      } else {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          'request.uri' : "/user/"
        }, 'attributes should only have request/response params')
      }
    })

    helper.randomPort(function(_port) {
      port = _port
      server.listen(port, TEST_HOST, function() {
        var url = TEST_URL + port + '/user/'
        helper.makeGetRequest(url, function(error, response, body) {
          if (error) t.fail(error)

          t.ok(/application\/json/.test(response.headers['content-type']),
               "got correct content type")
          t.deepEqual(JSON.parse(body), {"yep":true}, "Express correctly serves.")
        })
      })
    })
  })

  t.test("route variables", function(t) {
    t.plan(5)
    var agent = helper.instrumentMockedAgent({
      express4: true,
      send_request_uri_attribute: true
    })
    var app = require('express')()
    var server = require('http').createServer(app)
    var port = null

    t.tearDown(function() {
      server.close()
      helper.unloadAgent(agent)
    })

    // set apdexT so apdex stats will be recorded
    agent.config.apdex_t = 1

    // set attributes.enabled so we get the data we need.
    agent.config.attributes.enabled = true

    app.get('/user/:id', function(req, res) {
      t.ok(agent.getTransaction(), "transaction is available")

      res.send({yep : true})
      res.end()
    })

    agent.on('transactionFinished', function(transaction) {
      t.ok(transaction.trace, 'transaction has a trace.')
      var attributes = transaction.trace.attributes.get('transaction_tracer')
      if (attributes.httpResponseMessage) {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "httpResponseMessage": "OK",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          "id" : "5",
          'request.uri' : "/user/5"
        }, 'attributes should include route params')
      } else {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          "id" : "5",
          'request.uri' : "/user/5"
        }, 'attributes should include route params')
      }
    })

    helper.randomPort(function(_port) {
      port = _port
      server.listen(port, TEST_HOST, function() {
        var url = TEST_URL + port + '/user/5'
        helper.makeGetRequest(url, function(error, response, body) {
          if (error) t.fail(error)

          t.ok(/application\/json/.test(response.headers['content-type']),
               "got correct content type")
          t.deepEqual(JSON.parse(body), {"yep":true}, "Express correctly serves.")
        })
      })
    })
  })

  t.test("query variables", {timeout : 1000}, function(t) {
    t.plan(5)
    var agent = helper.instrumentMockedAgent({
      express4: true,
      send_request_uri_attribute: true
    })
    var app = require('express')()
    var server = require('http').createServer(app)
    var port = null

    t.tearDown(function() {
      server.close()
      helper.unloadAgent(agent)
    })

    // set apdexT so apdex stats will be recorded
    agent.config.apdex_t = 1

    // set attributes.enabled so we get the data we need.
    agent.config.attributes.enabled = true

    app.get('/user/', function(req, res) {
      t.ok(agent.getTransaction(), "transaction is available")

      res.send({yep : true})
      res.end()
    })

    agent.on('transactionFinished', function(transaction) {
      t.ok(transaction.trace, 'transaction has a trace.')
      var attributes = transaction.trace.attributes.get('transaction_tracer')
      if (attributes.httpResponseMessage) {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "httpResponseMessage": "OK",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          "name" : "bob",
          'request.uri' : "/user/"
        }, 'attributes should include query params')
      } else {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          "name" : "bob",
          'request.uri' : "/user/"
        }, 'attributes should include query params')
      }
    })

    helper.randomPort(function(_port) {
      port = _port
      server.listen(port, TEST_HOST, function() {
        var url = TEST_URL + port + '/user/?name=bob'
        helper.makeGetRequest(url, function(error, response, body) {
          if (error) t.fail(error)

          t.ok(/application\/json/.test(response.headers['content-type']),
               "got correct content type")
          t.deepEqual(JSON.parse(body), {"yep":true}, "Express correctly serves.")
        })
      })
    })
  })

  t.test("route and query variables", function(t) {
    t.plan(5)
    var agent = helper.instrumentMockedAgent({
      express4: true,
      send_request_uri_attribute: true
    })
    var app = require('express')()
    var server = require('http').createServer(app)
    var port = null

    t.tearDown(function() {
      server.close()
      helper.unloadAgent(agent)
    })

    // set apdexT so apdex stats will be recorded
    agent.config.apdex_t = 1

    // set attributes.enabled so we get the data we need.
    agent.config.attributes.enabled = true

    app.get('/user/:id', function(req, res) {
      t.ok(agent.getTransaction(), "transaction is available")

      res.send({yep : true})
      res.end()
    })

    agent.on('transactionFinished', function(transaction) {
      t.ok(transaction.trace, 'transaction has a trace.')
      var attributes = transaction.trace.attributes.get('transaction_tracer')
      if (attributes.httpResponseMessage) {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "httpResponseMessage": "OK",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          "id" : "5",
          "name" : "bob",
          'request.uri' : "/user/5"
        }, 'attributes should include query params')
      } else {
        t.deepEqual(attributes, {
          "request.headers.host" : "localhost:" + port,
          "request.method" : "GET",
          "response.status" : 200,
          "httpResponseCode": "200",
          "response.headers.contentLength" : "12",
          "response.headers.contentType" : "application/json; charset=utf-8",
          "id" : "5",
          "name" : "bob",
          'request.uri' : "/user/5"
        }, 'attributes should include query params')
      }
    })

    helper.randomPort(function(_port) {
      port = _port
      server.listen(port, TEST_HOST, function() {
        var url = TEST_URL + port + '/user/5?name=bob'
        helper.makeGetRequest(url, function(error, response, body) {
          if (error) t.fail(error)

          t.ok(/application\/json/.test(response.headers['content-type']),
               "got correct content type")
          t.deepEqual(JSON.parse(body), {"yep":true}, "Express correctly serves.")
        })
      })
    })
  })

  t.test("query params mask route attributes", function(t) {
    var agent = helper.instrumentMockedAgent({
      express4: true,
      send_request_uri_attribute: true
    })
    var app = require('express')()
    var server = require('http').createServer(app)
    var port = null

    t.tearDown(function() {
      server.close()
      helper.unloadAgent(agent)
    })

    // set apdexT so apdex stats will be recorded
    agent.config.apdex_t = 1

    // set attributes.enabled so we get the data we need.
    agent.config.attributes.enabled = true

    app.get('/user/:id', function(req, res) {
      res.end()
    })

    agent.on('transactionFinished', function(transaction) {
      var expectedValues = {
            "request.headers.host" : "localhost:" + port,
            "request.method" : "GET",
            "response.status" : 200,
            "httpResponseCode": "200",
            "id" : 5,
            'request.uri': "/user/5"
      }
      var possibleExpected = {
        "httpResponseMessage": "OK",
        "response.headers.contentLength": 0
      }
      var keys = ['response.headers.contentLength', 'httpResponseMessage']
      var attributes = transaction.trace.attributes.get('transaction_tracer')
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        var value = attributes[key]
        if (value !== undefined) {
          expectedValues[key] = possibleExpected[key]
        }
      }
      t.deepEqual(attributes,
          expectedValues, 'attributes should include query params')
      t.end()
    })

    helper.randomPort(function(_port) {
      port = _port
      server.listen(port, TEST_HOST, function() {
        helper.makeGetRequest(TEST_URL + port + '/user/5?id=6')
      })
    })
  })
})
