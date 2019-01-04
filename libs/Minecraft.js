const axios = require('axios');
const faker = require('faker');

const check = (word, callback) => {
      var url = `https://api.mojang.com/users/profiles/minecraft/${word}`;
      var status = "";

      axios.get(url, null, { "headers": { "User-Agent": faker.internet.userAgent }})
      .then(results = (r) => {
         var milliseconds = new Date().getTime();
         try {
            var data = JSON.parse(r.data);
            status = "taken";
         } catch(err) {
            status = "available";
         }
         callback(status, milliseconds)
      })
      .catch(console.error)

}

module.exports = check;