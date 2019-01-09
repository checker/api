const twitch = require('twitch-api-v5');

const check = (word, callback) => {
   twitch.clientID = process.env.TWITCH_CLIENT_ID;

   twitch.users.usersByName({"users": [word]}, function(error, response) {
      if(error) {
         console.log(error);
      } else {
         var status = (response['_total'] == 1) ? "taken" : "available";
         var milliseconds = new Date().getTime();
         callback(status, milliseconds)
      }
   });
}

module.exports = check;