var Botkit = require('botkit');
var Witbot = require('witbot')

var slackToken = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: require('./config').token
})

})

bot.startRTM(function(err,bot,payload) {
  if (err) {
    console.log(err)
    throw new Error('Could not connect to Slack');
  }
})

var witbot = Witbot(witToken)
