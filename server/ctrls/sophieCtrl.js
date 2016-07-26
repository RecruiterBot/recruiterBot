module.exports = ( Botkit, app, mongoURI ) => {

  const botkit_mongo_storage = require( '../sophiebot/storage' )( { mongoURI });
  const controller = Botkit.slackbot( {
    storage: botkit_mongo_storage
  } );

  const bot = controller.spawn({
    token: require( '../sophiebot/config' ).token,
  })

  controller.hears( [ 'find all students' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
    controller.storage.students.all( ( err, allStudents ) => {
      if ( err ) {
        console.log( 'err', err )
      }
      console.log( 'students', allStudents )
        bot.reply( message, {
          'text': 'I found ' + allStudents[ 0 ].name.firstName + ' ' + allStudents[ 0 ].name.lastName
        } )
    } )
  } )

  controller.hears( ["sophie", "I need a web developer", "good ones", /^.{0.}sophie.{0.}$/ ], [ "direct_message", "ambient" ], ( bot, message ) => {
    if( message.text === "sophie" ){
      bot.reply( message,'What can I do for you, ?' );
    }
    else if ( message.text ==="I need a web developer" ){
      bot.reply( message, 'Keep calm I can help you with that. What kind of developer are you looking for?' )
    }
    else if ( message.text === "good ones" ){
      bot.reply( message, 'Ok, excellent, here is what you need.' )
    }
    else {
      bot.reply( message, "I only speak a few phrases right now, try me out late." );
    }
  } );

  bot.startRTM( ( err, bot, payload ) => {
    if ( err ) {
      console.log( err )
      throw new Error( 'Could not connect to Slack' );
    }
  } );
}
