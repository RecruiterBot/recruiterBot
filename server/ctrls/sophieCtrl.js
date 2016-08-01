const Students = require( '../schemas/Students' );
const attachmentCtrl = require( './attachmentCtrl' );
const searchCtrl = require( './searchCtrl' );
const deleteCtrl = require( './deleteCtrl' );

module.exports = ( ApiaiBotkit, Botkit, app, mongoURI ) => {

  // const apiToken = require( '../sophiebot/config' ).apiToken;
  const controller = Botkit.slackbot();

  const bot = controller.spawn( {
    token: require( '../sophiebot/config' ).botToken
  } );

  searchCtrl( Botkit, app, mongoURI, controller, bot )
  deleteCtrl( bot, controller )

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



  // controller.hears( ['looking for a job', 'I need a job','connect me with employer'],'direct_message,direct_mention,mention', ( bot, message ) => {
  //   // convo.say(`Excellent I can help you with that I'll ask you some questions and save that information so a recruiter can contact you with open positions.`);
  //   const firstNameQuestion = `Excellent I can help you with that I'll ask you some questions and save that information so a recruiter can contact you with open positions. What is your first name?`;
  //   const lastNameQuestion = `What is your last name?`;
  //   const locationsQuestion = `In what city and state are you looking for a position?`
  //   const emailQuestion = `What is your email?`;
  //   const githubQuestion = `Do you have a github? if so paste link in. If no type "no"`;
  //   const linkedinQueston = `Do you have a linkedIn vanity URL? if so paste link in. If no type "no"`;
  //   const personalWebsiteQuestion = `Do you have a personal website? if so past link in. If no typoe "no"`;
  //   const skillsQuestion = `What skills do you have?`

  //   askFirstName = ( response, convo ) => {
  //     convo.ask( firstNameQuestion, ( response, convo ) => {
  //       convo.say(`Ok the first name I have saved is ${ response.text}`)
  //       askLastName( response, convo );
  //       convo.next();
  //     })
  //   }
  //   askLastName = ( response, convo) => {
  //   convo.ask( lastNameQuestion, ( response, convo ) => {
  //     convo.say( `Ok the last name I have saved is ${ response.text}` )
  //     askLocations( response, convo );
  //     convo.next();
  //   })
  //   }
  //   askLocations = ( response, convo ) => {
  //     convo.ask( locationsQuestion, ( response, convo ) => {
  //       convo.say(`Ok the location I have saved is ${ response.text }`)
  //       askEmail (response, convo );
  //       convo.next();
  //     })
  //   }
  //   askEmail = ( response, convo ) => {
  //     convo.ask( emailQuestion, ( response, convo ) => {
  //       convo.say(`Ok the email I have saved is ${ response.text }` )
  //       askGithub ( response, convo );
  //       convo.next();
  //     })
  //   }
  //   askGithub = ( response, convo ) => {
  //     convo.ask( githubQuestion, ( response, convo ) => {
  //       if(response.text === "no"){
  //         askLinkedin ( response, convo );
  //         convo.next();
  //       } else {
  //     convo.say(` Great, the github URL I have for you is ${ response.text }`)
  //       askLinkedin ( response, convo );
  //       convo.next();
  //     }
  //     })
  //   }
  //   askLinkedin = ( response, convo ) => {
  //     convo.ask( linkedinQueston, ( response, convo ) => {
  //       if( response.text === "no"){
  //         askPersonalWebsite( response, convo )
  //         convo.next();
  //       } else {
  //         convo.say(`Excellent! almost done, the LinkedIn Vanity URL I have saved is ${ response.text }`)
  //         askPersonalWebsite( response, convo )
  //         convo.next();
  //       }
  //     } )
  //   }
  //   askPersonalWebsite = (response, convo ) => {
  //   convo.ask( personalWebsiteQuestion, ( response, convo ) => {
  //       if( response.text === "no"){
  //         askSkills( response, convo )
  //       } else {
  //         convo.say(`Ok the personal website I have save is ${ response.text }`)
  //         askSkills( response, convo )
  //         convo.next();
  //       }
  //   })
  //   }
  //   askSkills = ( response, convo ) => {
  //     convo.ask( skillsQuestion, ( response, convo ) => {
  //         let skills = []
  //       for (var i = 0; i<skills.length; i++){
  //         if (response.text == 'javaScript'){
  //           skills.push ('javaScript');
  //         }else if ( response.text == 'Angular'){
  //             skills.push('Angular')
  //           }
  //           else if ( response.text == 'React'){
  //             skills.push('React')
  //           }
  //         }
  //         convo.next();
  //         convo.on(`end`, (convo) => {
  //           if(convo.status === `completed` ){
  //             const savedStudentInfo = convo.extractResponses();

  //             const savedFirstName = convo.extractResponse(firstNameQuestion )
  //             const savedLastName =
  //             convo.extractResponse( lastNameQuestion )
  //             //  console.log( 'student', savedStudentInfo )
  //             const savedLocations = convo.extractResponse( locationsQuestion )
  //             const savedEmail = convo.extractResponse(
  //               emailQuestion )
  //               const savedSkills = convo.extractReponse( skillsQuestion )

  //               const studentObj = {
  //                 "name": {
  //                   "firstName": savedFirstName,
  //                   "lastName": savedLastName
  //                 },
  //                 "locations": savedLocations,
  //                 "email": savedEmail,
  //                 "skills": {savedSkills}
  //               };

  //             }

  //           })
  //         return skills;
  //     })
  //   }




          // invoke conversation //

  //   bot.startConversation( message, askFirstName );
  // } )

  controller.hears( [ 'find all students' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
    Students.find( {}, ( err, allStudents ) => {
      if ( err ) {
        console.log( 'err', err )
      }

      // create the attachment

      const attachment = createAttachment( allStudents );
      // console.log( 'attachment', attachment )

  // // loop through the attachment and send a reply

      for (var i = 0; i < attachment.length; i++) {
        bot.reply( message, attachment[i] )
      }
    } )
  } )

  bot.startRTM( ( err, bot, payload ) => {
    if ( err ) {
      console.log( err )
      throw new Error( 'Could not connect to Slack' );
    }

  } );
}


