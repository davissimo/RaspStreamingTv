var HotSpot = require('./fon-hotspot.js');
var ChannelList = require('./channel-list.js');
var Remote = require('./keyboard-remote.js');
var Player = require('./player.js');
var messages = require('./messages.json');

var hotSpot = new HotSpot();
var channelList = new ChannelList();
var remote = new Remote();
var player = new Player();

var l = hotSpot.login();

l.on('done', getChannelList);
l.on('error', function(error) { 
    handleError(messages.hotSpotError, error);
});

function getChannelList() {
    channelList.get(function(error, channels)  {
        if (error) handleError(messages.channelsError, error);
        initialize(channels);
    });
}

function handleError(caption, error) {
    console.log(caption + ": " + error.message);
    process.exit();
}

function initialize(channels) {
    var channelIndex = 0;
    playChannel();

    remote.on('program-down', function() {
        channelIndex--;

        if (channelIndex < 0)
            channelIndex = channels.length - 1;

        playChannel();
    });

    remote.on('program-up', function() {
        channelIndex++;

        if(channelIndex >= channels.length)
            channelIndex = 0;

        playChannel();
    });

    remote.on('power-off', function() {
        process.exit();
    });

    function playChannel() {
        var channel = channels[channelIndex];
        player.play(channel);
    }
}