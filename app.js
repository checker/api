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

function checkAuthKey(req, res, next) {
  var keys = require('./apikeys.json');
  var appkey = req.get('og-apikey');

  if (keys.authorized.includes(appkey)) {
    next()
  } else {
    res.json({"status": "unauthorized"});
  }
}

let cacheWithRedis = apicache.options({ redisClient: redis.createClient() }).middleware;

/* GET root api endpoint */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/docs.html'));
});

router.get('/check/services', function(req, res) {
  var simple = {"services":[]};
  var advanced = require('./services.json');
  for (var key in advanced.services) {
  	simple.services.push(advanced.services[key].slug)
  }
  res.json(simple);
});

router.get('/check/services/details', function(req, res) {
  var obj = require('./services.json');
  res.json(obj);
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

app.listen(8080, 'localhost');

module.exports = app;
