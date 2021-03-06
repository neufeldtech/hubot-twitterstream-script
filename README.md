# hubot-twitterstream-script

A [Hubot](http://hubot.github.com) script using the Twitter streaming API to be notified on defined hashtags.

## Install

- Install via npm
```
npm install hubot-twitterstream-script --save
```
- Add the following code in your external-scripts.json file.
```
["hubot-twitterstream-script"]
```

- Create an application on https://dev.twitter.com
- Set the following environment variables before running hubot
```
export TWITTER_CONSUMER_KEY=XXXXXXXXXXXXXXX
export TWITTER_CONSUMER_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export TWITTER_ACCESS_TOKEN_KEY=XXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export TWITTER_ACCESS_TOKEN_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- Run hubot
```
bin/hubot
```

## Usage

As defined in the twitterstream.js header you can:

Subscribe to hashtags (launch command multiple times for multiple tags):

    hubot twitterstream watch github

List hashtags you subscribed to:

    hubot twitterstream list

Clear subscriptions:

    hubot twitterstream clear

Note: There are some stacktraces due to exception comming from the ntwitter library when creating multiple subscriptions but all is still working fine.

## License

(The MIT License)

Copyright (c) 2013 [Christophe Hamerling] (http://chamerling.org)  

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
