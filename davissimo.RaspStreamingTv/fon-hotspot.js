var util = require('util');
var events = require('events');
var request = require('request');
var config = require('./config');

var HotSpot = function() {
    var emitter = new events.EventEmitter();

    this.login = function() {
        // enable cookies and follow redirects
        request = request.defaults({jar:true, followAllRedirects:true});

        request.get(config.channelListUrl, function (error, response, body) {        
            if (error) {
                emitter.emmit('error', error);
                return;
            }

            //todo ref: extract
            var isFonSpot = response.request.href == config.fonRedirectUrl;

            if (isFonSpot) {
                request.post(config.fonLogInUrl,
                     {form: {'login[user]': config.fonUser, 
                             'login[pass]': config.fonPass,
                             //'login_reminder': 'on',
                             'commit': 'Login'}},
                      function (error, response, body) {
                          var hasSucceeded = !error && 
                              response.request.href == config.fonConfirmationUrl

                          if (hasSucceeded)
                              emitter.emit('done');
                          else
                              emitter.emit('error', error || new Error(response.request.href));
                      });
            }
            else {
                emitter.emit('done');
            }
        });

        return emitter;
    };
};

module.exports = HotSpot;