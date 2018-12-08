require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const axios = require('axios');
const apicache = require('apicache');
const redis = require('redis');
const fs = require('fs');
const path = require('path');

const CheckTwitter = require('./libs/Twitter');
const CheckInstagram = require('./libs/Instagram');
const CheckSteam = require('./libs/Steam');
const CheckYoutube = require('./libs/Youtube');
const CheckMixer = require('./libs/Mixer');

app.use(cors())
app.use(router);
app.use(timeout('5s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(haltOnTimedout);
app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

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
    res.json({"status": "unauthorized"});
  }
}

let cacheWithRedis = apicache.options({ redisClient: redis.createClient(process.env.REDIS_URL) }).middleware;

/* GET root api endpoint */
router.get('/', goToDocs);

router.get('/check/services', function(req, res) {
  var simple = {"services":[]};
  var advanced = require('./services.json');
  for (var key in advanced.services) {
  	simple.services.push(advanced.services[key].slug)
  }
  res.type('json');
  res.json(200, simple);
});

router.get('/check/:service', function(req, res) {
  var service = req.params.service;
  var advanced = require('./services.json');
  var json = {};
  for (var key in advanced.services) {
  	if (service === advanced.services[key].slug) {
      json = advanced.services[key];
      break;
    }
  }
  res.type('json');
  res.json(200, json);
});

router.get('/check/services/details', function(req, res) {
  var json = require('./services.json');
  res.type('json');
  res.json(200, json);
});

router.get('/check/:service/:word', [cacheWithRedis('6 hours')], function(req, res) {
   var service = req.params.service;
   var word = req.params.word;

   switch (service) {
      case "twitter":
         CheckTwitter(service, word, res);
         break;
      case "instagram":
         CheckInstagram(service, word, res);
         break;
      case "steamid":
         CheckSteam(service, word, res);
         break;
      case "steamgroup":
         CheckSteam(service, word, res);
         break;
      case "youtube":
         CheckYoutube(service, word, res);
         break;
      case "mixer":
         CheckMixer(service, word, res);
         break;
   }
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

app.listen(process.env.PORT || 5000);

module.exports = app;
