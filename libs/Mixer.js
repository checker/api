const express = require('express');
const router = express.Router();
const axios = require('axios');

function CheckMixer(service, word, res) {
   res.type('json');

   const url = `https://mixer.com/api/v1/channels/${word}`;

   var status = "";

   axios.get(url).then(function (obj) {
      var milliseconds = new Date().getTime();
      status = ('statusCode' in obj.data) ? "available" : "taken";
      res.json({ service: service, username: word, status: status, timestamp: milliseconds });
   }).catch(function () {
      var milliseconds = new Date().getTime();
      res.json({ service: service, username: word, status: "available", timestamp: milliseconds });
   });
}

module.exports = CheckMixer;