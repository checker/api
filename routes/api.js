const express = require('express');
const router = express.Router();
const axios = require('axios');

const CheckTwitter = require('../libs/Twitter');
const CheckInstagram = require('../libs/Instagram');
const CheckSteam = require('../libs/Steam');
const CheckMinecraft = require('../libs/Minecraft');
const CheckYoutube = require('../libs/Youtube');

/* GET root api endpoint */
router.get('/', function(req, res, next) {
  res.send('this is the root api endpoint');
});

router.get('/check/:service/:word', function(req, res, next) {
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
   }
});

module.exports = router;