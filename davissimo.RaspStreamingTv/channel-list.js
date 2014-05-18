var request = require('request');
var config = require('./config')

var ChannelList = function() {
    this.get = function(callback) {
        request(config.channelListUrl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              callback(null, JSON.parse(body));
          }
          else {
              callback(error || new Error(response.statusCode), null);
          }
        });
    };
};

module.exports = ChannelList;