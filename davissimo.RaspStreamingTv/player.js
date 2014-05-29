var spawn = require('child_process').spawn;

var StreamType = Object.freeze({
    MMS : 'mms', 
    RTMP : 'rtmp'
});

var Player = function() {
    this.play = function(channel) {
        if (channel.streamType == StreamType.MMS)
            playMmsStream(channel);
        else if (channel.streamType == StreamType.RTMP)
            playRtmpStream(channel);
    }

    //todo: output to omxplayer
    function playMmsStream(channel) {
        //if (process) 
        //    process.kill(); 
        
        var mplayer = spawn('mplayer', [channel.url, '-dumpstream', '-dumpfile mss-stream']);
        var omxplayer = spawn('omxplayer', ['-o hdmi', 'mms-stream']); // todo: paremeterize

        mplayer.on('error', handleError);
        omxplayer.on('error', handleError);
    }

    function playRtmpStream(channel) {
	var args = channel.url.split(' ');
        args.push('-o', '/tmp/rtmpstream');
	
        var rtmpdump = spawn('rtmpdump', args);
        var omxplayer = spawn('omxplayer', ['-o', 'hdmi', '/tmp/rtmpstream']);

        rtmpdump.on('error', handleError);
        omxplayer.on('error', handleError); // todo: move omxplayer centrally

        rtmpdump.stdout.on('data', function(data) { console.log(data.toString()); });
        omxplayer.stdout.on('data', function(data) { console.log(data.toString()); });
    }

    function handleError(err) {
        console.log(err);
    }

}

module.exports = Player;
