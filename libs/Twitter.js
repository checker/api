const Twitter = require('twitter-lite');

const check = (word, callback) => {
   var config = {
      "consumer_key": process.env.TWTR_CONSUMER_KEY,
      "consumer_secret": process.env.TWTR_CONSUMER_SECRET,
      "access_token_key": process.env.TWTR_ACCESS_TOKEN_KEY,
      "access_token_secret": process.env.TWTR_ACCESS_TOKEN_SECRET
   };
   var client = new Twitter(config);

   client.get('users/show', {screen_name: word, include_entities: false})
         .then((r) => {
            var milliseconds = new Date().getTime();
            var status = ('screen_name' in r) ? "taken" : "available";
            callback(status, milliseconds)
         })
         .catch(console.error)

}

module.exports = check;