
const searchCtrl = require( './searchCtrl' );
const deleteCtrl = require( './deleteCtrl' );
const createCtrl = require( './createCtrl' );
const helpCtrl = require( './helpCtrl' );

module.exports = ( Botkit, app, mongoURI ) => {

  const controller = Botkit.slackbot();

  const bot = controller.spawn( {
    token: require( '../sophiebot/config' ).botToken || process.env.token
  } );


  searchCtrl( bot, controller );
  deleteCtrl( bot, controller );
  createCtrl( bot, controller );
  helpCtrl( bot, controller );


  bot.startRTM( ( err, bot, payload ) => {
    if ( err ) {
      console.log( err )
      throw new Error( 'Could not connect to Slack' );
    }

  } );

  // controller.hears( [ 'find all students' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
  //   Students.find( {}, ( err, allStudents ) => {
  //     if ( err ) {
  //       console.log( 'err', err )
  //     }

  //     // create the attachment

  //     const attachment = createAttachment( allStudents );
  //     // console.log( 'attachment', attachment )

  // // // loop through the attachment and send a reply

  //     for (var i = 0; i < attachment.length; i++) {
  //       bot.reply( message, attachment[i] )
  //     }
  //   } )
  // } )

}
