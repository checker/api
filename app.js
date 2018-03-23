const express = require('express');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const axios = require('axios');
const apicache = require('apicache');
const redis = require('redis');

const CheckTwitter = require('./libs/Twitter');
const CheckInstagram = require('./libs/Instagram');
const CheckSteam = require('./libs/Steam');
const CheckMinecraft = require('./libs/Minecraft');
const CheckYoutube = require('./libs/Youtube');
const CheckMixer = require('./libs/Mixer');
const CheckTwitch = require('./libs/Twitch');

app.use(router);
app.use(timeout('2s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(haltOnTimedout);

let cacheWithRedis = apicache.options({ redisClient: redis.createClient() }).middleware;

/* GET root api endpoint */
router.get('/', function(req, res, next) {
  res.send('this is the root api endpoint');
});

router.get('/check/:service/:word', cacheWithRedis('6 hours'), function(req, res, next) {
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
      case "minecraft":
         CheckMinecraft(service, word, res);
         // half working, may have to change to 3rd party api
         break;
      case "youtube":
         CheckYoutube(service, word, res);
         break;
      case "mixer":
         CheckMixer(service, word, res);
         break;
      case "twitch":
         CheckTwitch(service, word, res);
         break;
   }
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

app.listen(8080, 'localhost');

module.exports = app;
