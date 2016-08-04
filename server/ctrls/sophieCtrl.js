const Students = require( '../schemas/Students' );
const attachmentCtrl = require( './attachmentCtrl' );
const searchCtrl = require( './searchCtrl' );
const deleteCtrl = require( './deleteCtrl' );
const createCtrl = require( './createCtrl' );
const helpCtrl = require( './helpCtrl' );

module.exports = ( ApiaiBotkit, Botkit, app, mongoURI ) => {

  // const apiToken = require( '../sophiebot/config' ).apiToken;
  const controller = Botkit.slackbot();

  const bot = controller.spawn( {
    token: require( '../sophiebot/config' ).botToken || process.env.token
  } );

  searchCtrl( bot, controller );
  deleteCtrl( bot, controller );
  createCtrl( bot, controller );
  searchCtrl( bot, controller );
  helpCtrl( bot, controller );

  // const apiai = ApiaiBotkit( apiToken );

  // controller.hears('.*', 'direct_message,direct_mention,mention', ( bot, message ) => {
  //   console.log( 'ctrl message', message );
  //   apiai.process( message, bot );
  // } );

  // apiai.action( 'candidate.search.findSkills', ( message, resp, bot ) => {
  //     console.log( 'message', message );
  //     console.log( 'resp', resp );
  //     console.log( 'bot', bot );
  //     const responseText = resp.result.fullfillment.speech;


  //   } )
  //   .action( 'input.unkown', ( message, resp, bot ) => {
  //     bot.reply( message, "Sorry, I don't understand" );
  //     console.log( 'message', message );
  //     console.log( 'resp', resp );
  //     console.log( 'bot', bot );
  //   } );



  
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

  bot.startRTM( ( err, bot, payload ) => {
    if ( err ) {
      console.log( err )
      throw new Error( 'Could not connect to Slack' );
    }

  } );
}


