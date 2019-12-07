'use strict';

/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.loginPOST = function(registration) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "expires" : "2000-01-23T04:56:07.000+00:00",
  "api_key" : "api_key"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

