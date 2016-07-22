var Botkit = require('botkit');
var controller = Botkit.slackbot();

controller.hears(["sophie","I need a web developer","good ones",/^.{0.}sophie.{0.}$/],["direct_message","ambient"],function(bot,message) {
  if(message.text=== "sophie"){
  // do something to respond to message
  // all of the fields available in a normal Slack message object are available
  // https://api.slack.com/events/message
  bot.reply(message,'What can I do for you?');
}
else if (message.text ==="I need a web developer"){
  bot.reply(message, 'Keep calm I can help you with that. What kind of developer are you looking for?')
}
else if (message.text === "good ones"){
  bot.reply(message, 'Ok, excellent, here is what you need.')
}
else {
  bot.reply(message, "I only speak a few phrases right now, try me out late.");
}
});
var bot = controller.spawn({
  token: require('./config').token
})

bot.startRTM(function(err,bot,payload) {
  if (err) {
    console.log(err)
    throw new Error('Could not connect to Slack');
  }
});
