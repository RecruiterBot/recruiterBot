
const searchCtrl = require( './searchCtrl' );
const deleteCtrl = require( './deleteCtrl' );
const createCtrl = require( './createCtrl' );
const helpCtrl = require( './helpCtrl' );


module.exports = ( ApiaiBotkit, Botkit, app, mongoURI ) => {

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


  // const apiToken = require( '../sophiebot/config' ).apiToken;

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

}
