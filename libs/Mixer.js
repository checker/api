const axios = require('axios');

const check = (word, callback) => {
   const url = `https://mixer.com/api/v1/channels/${word}`;

   var status = "";

   axios.get(url).then(function (obj) {
      var milliseconds = new Date().getTime();
      status = ('statusCode' in obj.data) ? "available" : "taken";
      callback(status, milliseconds)
   }).catch(function () {
      var milliseconds = new Date().getTime();
      callback("available", milliseconds)
   });
}

module.exports = check;