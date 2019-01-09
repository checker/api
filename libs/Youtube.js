const axios = require('axios');

const check = (word, callback) => {
   const baseUrl = `https://www.youtube.com/${word}`;
   const userUrl = `https://www.youtube.com/user/${word}`;
   const chanUrl = `https://www.youtube.com/c/${word}`;

   const urls = [baseUrl, userUrl, chanUrl];
   const types = ["base", "user", "channel"];

   var promises = new Array();
   var codeObj = new Object();
   var status = "";

   function axiosCall(url, type) {
      return new Promise((resolve, reject) => {
         axios.get(url, null, {"timeout": 2500}).then((response, error) => {
            codeObj[type] = response.status;
            resolve(response.status);
         }).catch((error) => {
            if (error.response) {
               codeObj[type] = error.response.status;
               resolve(error.response.status);
            } else {
               reject(error);
            }
         });
       });
   }

   for ( var i = 0 ; i < 3 ; i++ ) {
      var promise = axiosCall(urls[i], types[i]);
      promises.push(promise);
   }
   
  Promise.all(promises).then((codes) => {

      var milliseconds = new Date().getTime();

      if (codes === undefined || codes.length == 0) {
         status = "available";
      } else {
         var code = codes.reduce(function(a, b, c){ return (a === b) ? a : c });
   
         switch (code) {
            case 200:
               status = "taken";
               break;
            case 404:
               status = "available";
               break;
            case 2:
               status = "taken";
               break;
            default:
               status = "unknown";
               break;
         }
      }
           
      callback(status, milliseconds, codeObj)
      
   }).catch(console.error);

}

module.exports = check;