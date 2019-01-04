require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const apicache = require('apicache');
const redis = require('redis');
const fs = require("fs")

// Load services.json
const advanced = require('./services.json');

// Used for storing active modules
let modules = []

app.use(cors())
app.use(router);
app.use(timeout('5s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(haltOnTimedout);
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  res.header('x-powered-by', 'github.com/checker')
  next();
});

const loadLibs = (callback) => {
  // This isn't great, but it works.
  advanced["services"].forEach(service => {
    console.log(`[BOOTSTRAP] Bootstrapping ${service.name} (${service.slug})`)
    modules[service.slug] = {"manifest": service, "instance": require(`./${service.libPath}`)}
  })
  console.log(`[BOOTSTRAP] Module start finished, loaded ${modules.length} modules.`)
  callback()
}

function goToDocs(req, res) {
  const targetUrl = "https://app.swaggerhub.com/apis-docs/CrocBuzz/penguin-api/";
  res.redirect(targetUrl);
}

function checkAuthKey(req, res, next) {
  var keys = require('./apikeys.json');
  var appkey = req.get('og-apikey');

  if (keys.authorized.includes(appkey)) {
    next()
  } else {
    res.status(401) // http: UNAUTHORIZED
    res.json({"status": "unauthorized"});
  }
}

let cacheWithRedis = apicache.options({ redisClient: redis.createClient(process.env.REDIS_URL) }).middleware;

/* GET root api endpoint */
router.get('/', goToDocs);

router.get('/check/services', function(req, res) {
  // Note: see APICHANGES.md for possible changes
  var simple = {"services":[]};
  for (var key in advanced.services) {
  	simple.services.push(advanced.services[key].slug)
  }
  res.json(simple);
});

router.get('/check/:service', function(req, res) {
  var service = req.params.service;
  var json = {};
  for (var key in advanced.services) {
  	if (service === advanced.services[key].slug) {
      json = advanced.services[key];
      break;
    }
  }
  res.json(json)
});

router.get('/check/services/details', function(req, res) {
  var json = require('./services.json');
  res.json(json)
});

router.get('/check/:service/:word', function(req, res) {
  var service = req.params.service;
  var word = req.params.word;
  if (modules[service] == undefined) {
    res.status(400)
    res.json({"error": "INVALID_SERVICE", "message": "Invalid service selected, please see /check/services for a list."})
  }else {
    // Seemingly valid service, request data on 'word':
    modules[service].instance(word, (status, timestamp, statusBreakdown) => {
      // Result will be an array containing [status, epoch, extra information]
      const json = {
        "service": modules[service]["manifest"]["slug"], // Use the slug, not what the user sent
        "username": word, // Return what the user sent, I'm lazy.
        "status": status, // Return the status "available"/"taken"/"unknown"
        "timestamp": timestamp, // Return an MS epoch time
        "statusBreakdown": statusBreakdown || undefined // Return the breakdown (or undefined)
      }
      res.json(json)
    })
  }
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

loadLibs(() => {
  // Start server when modules have loaded
  app.listen(process.env.PORT || 5000, () => {
    console.log(`[SERVER] Started listening on ${process.env.PORT || 5000}`)
  });
})

module.exports = app;
