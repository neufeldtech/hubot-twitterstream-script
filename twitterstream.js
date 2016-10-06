// Description:
//  Watch Twitter streams
//
// Commands:
//   hubot twitterstream watch <tag>   - Start watching a tag
//   hubot twitterstream unwatch <tag> - Stop  watching a tag
//   hubot twitterstream list          - Get the watched tags list
//   hubot twitterstream clear         - Kill them all!
//
// Configuration:
//
// The following environment variables are required. You will need to create an application at https://dev.twitter.com
// TWITTER_CONSUMER_KEY
// TWITTER_CONSUMER_SECRET
// TWITTER_ACCESS_TOKEN_KEY
// TWITTER_ACCESS_TOKEN_SECRET
//
// Examples:
//   hubot twitterstream watch github
//
// Author:
//   Christophe Hamerling
// Hacker:
//    Jordan Neufeld <myjc.niv@gmail.com>

var consumer_key = process.env.TWITTER_CONSUMER_KEY
var consumer_secret = process.env.TWITTER_CONSUMER_SECRET
var access_token_key = process.env.TWITTER_ACCESS_TOKEN_KEY
var access_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET

//The in-memory only array for the stream objects (NOT hubot's brain!)
var streamsMemory = []

var twitter = require('ntwitter'),
    _ = require('underscore');

var auth = {
    "consumer_key": consumer_key,
    "consumer_secret": consumer_secret,
    "access_token_key": access_token_key,
    "access_token_secret": access_token_secret
}

function initStream(tag, room, robot) {
    twit.stream('statuses/filter', { 'track': tag }, function(stream) {
        var streams = robot.brain.get('twitter.streams')
        var isAlreadySubscribedToThatStream = _.find(streams, function(s) {
            return (s.key == tag);
        });
        if (isAlreadySubscribedToThatStream) {
            return robot.messageRoom(room, "I'm already subscribed to " + tag)
        } else {
            streams.push({ key: tag, fn: stream, room: room });
            robot.brain.set('twitter.streams', streams)
            stream.on('error', function(error) {
                robot.logger.error(error)
            })
            stream.on('data', function(data) {
                robot.logger.debug(data.text)
                robot.messageRoom(room, ':twitter: @' + data.user.screen_name + " (" + data.user.name + ") - " + data.text + '\n');
            });

            stream.on('destroy', function(data) {
                robot.messageRoom(room, 'I do not watch ' + tag + ' anymore...')
            })
            robot.messageRoom(room, 'I started watching ' + tag);
        }
    });
}

function resumeStream(tag, room, robot, newStreamsObject) {

    twit.stream('statuses/filter', { 'track': tag }, function(stream) {
        streamsMemory.push({ key: tag, fn: stream, room: room });

        robot.logger.debug('resuming stream: ' + tag)
        stream.on('error', function(error) {
            robot.logger.error(error)
        })
        stream.on('data', function(data) {
            robot.logger.debug(data.text)
            robot.messageRoom(room, ':twitter: @' + data.user.screen_name + " (" + data.user.name + ") - " + data.text + '\n');
        });
        stream.on('destroy', function(data) {
            robot.messageRoom(room, 'I do not watch ' + tag + ' anymore...')
        })
    });
}
var twit = new twitter(auth);
twit.verifyCredentials(function(err, data) {
    if (err) {
        throw new Error(err);
    }
})


module.exports = function(robot) {
    var brainHasBeenLoaded = false
        //note, THIS SCRIPTS NEEEEDS A REDIS BRAIN
    robot.brain.on('loaded', function() {
        if (!brainHasBeenLoaded) {
            brainHasBeenLoaded = true
            robot.logger.debug('Loading twitter streams from brain')
            var streams = robot.brain.get('twitter.streams')
            if (!streams || streams.length < 1) {
                return robot.brain.set('twitter.streams', []) //initialize the streams array if it does not exist
            }
            //If we have stuff in our streams, lets re-initialize them now
            _.each(streams, function(s) {
                resumeStream(s.key, s.room, robot);
            });
            robot.brain.set('twitter.streams', streamsMemory)
        }
    });


    //debugging











    //end debugging
    robot.respond(/twitterstream watch (.*)$/i, function(msg) {
        var tag = msg.match[1]
        initStream(tag, msg.message.user.room, robot);
    });

    robot.respond(/twitterstream unwatch (.*)$/i, function(msg) {
        var tag = msg.match[1]
        var streams = robot.brain.get('twitter.streams')
        var stream = _.find(streams, function(s) {
            return (s.key == tag);
        });
        if (stream != undefined) {
            stream.fn.destroy();
            streams = _.without(streams, _.findWhere(streams, stream));
            robot.brain.set('twitter.streams', streams)
            msg.send('I stopped watching ' + tag);
        } else {
            msg.send('I do not known such tag.');
        }
    });

    robot.respond(/twitterstream list/i, function(msg) {
        var streams = robot.brain.get('twitter.streams')
        if (streams.length > 0) {
            _.each(streams, function(s) {
                msg.send(s.key);
            });
        } else {
            msg.send('I have no tags.');
        }
    });

    robot.respond(/twitterstream clear/i, function(msg) {
        var streams = robot.brain.get('twitter.streams')
        if (streams.length > 0) {
            _.each(streams, function(s) {
                s.fn.destroy();
                streams = _.without(streams, _.findWhere(streams, s));
            });
        } else {
            msg.send('I have no tags.');
        }
    });
}
