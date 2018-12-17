const httpRequest = require("request");
const httpProvider = {
  post(url, params) {
    let options = {
      url: url,
      form: params
    };

    return new Promise(function(resolve, reject) {
      httpRequest.post(options, function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
};

export default httpProvider;
