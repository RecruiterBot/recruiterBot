module.exports = ( Botkit, app, mongoURI ) => {

  const botkit_mongo_storage = require( '../sophiebot/storage' )( { mongoURI });
  const controller = Botkit.slackbot( {
    storage: botkit_mongo_storage
  } );

  const bot = controller.spawn( {
    token: require( '../sophiebot/config' ).token,
  } )

  controller.hears( [ 'find all students' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
    controller.storage.students.all( ( err, allStudents ) => {
      if ( err ) {
        console.log( 'err', err )
      }
      console.log( 'students', allStudents )
      createAttachment = ( arr ) => {
        const reply = [];
        arr.forEach( value => {
          const skills = Object.keys( value.skills ).join(", ")
          reply.push( {
            "attachments": [
              {
                "fallback": value.name.firstName + " " + value.name.lastName,
                "title": "<" + value.linkedIn + "|" + value.name.firstName + " " + value.name.lastName + ">",
                "fields": [
                  {
                    "title": "eMail address",
                    "value": value.email,
                    "short": true
                  }
                  ,
                  {
                    "title": "Years experience",
                    "value": value.yearsExperience.toString(),
                    "short": true
                  },
                  {
                    "title": "Skills",
                    "value": skills
                  }
                ]
              }
            ]
          } )
        } )
        return reply;
      }
      const attachment = createAttachment( allStudents );
      for (var i = 0; i < attachment.length; i++) {
        bot.reply( message, attachment[i] )
      }
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
