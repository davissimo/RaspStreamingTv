var util = require('util');
var events = require('events');
var keypress = require('keypress');

var Remote = function () {
    var self = this;

    // make 'process.stdin' begin emitting "keypress" events
    keypress(process.stdin);

    // without this, we would only get streams once enter is pressed
    process.stdin.setRawMode(true);

    // node app won't quit all by itself unless an error or process.exit() happens
    process.stdin.resume();

    // listen for the "keypress" event
    process.stdin.on('keypress', function (chunk, key) {
        // switch channel
        if (key && key.name == 'left') {
            self.emit('program-down');
        }
        else if (key && key.name == 'right') {
            self.emit('program-up');
        }

        // close application
        if (key && key.ctrl && key.name == 'c') {
            self.emit('power-off');
        }
    });
};

// extend the EventEmitter class using our Remote class
util.inherits(Remote, events.EventEmitter);

// we specify that this module is a refrence to the Remote class
module.exports = Remote;