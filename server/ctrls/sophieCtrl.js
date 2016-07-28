module.exports = ( ApiaiBotkit, Botkit, app, mongoURI ) => {

  const botkit_mongo_storage = require( '../sophiebot/storage' )( { mongoURI });
  // const apiToken = require( '../sophiebot/config' ).apiToken;
  const controller = Botkit.slackbot( {
    storage: botkit_mongo_storage
  } );

  const bot = controller.spawn( {
    token: require( '../sophiebot/config' ).botToken
  } );

  // const apiai = ApiaiBotkit( apiToken );

  // controller.hears('.*', 'direct_message,direct_mention,mention', ( bot, message ) => {
  //   console.log( 'ctrl message', message );
  //   apiai.process( message, bot );
  // } );

  // apiai.action( 'candidate.search', ( message, resp, bot ) => {
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






  // controller.hears( [ 'fill a position', 'looking for a dev' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
  //   const locQuestion = `In which city and state is the position located?`;
  //   const skillQuestion = `What skills does the ideal candidate possess?`;
  //   const expQuestion = `How many years experience does the ideal candidate need?`;

  //   askLocation = ( response, convo ) => {
  //     convo.ask( locQuestion, ( response, convo ) => {
  //       convo.say(`looking for candidates in ${ response.text }` );
  //       askSkills( response, convo );
  //       convo.next();
  //     } );
  //   }
  //   askSkills = ( response, convo ) => {
  //     convo.ask( skillQuestion, ( response, convo ) => {
  //       convo.say( `looking for candidates with experience in ${ response.text }` );
  //       askYearsExperience( response, convo );
  //       convo.next();
  //     } );
  //   }
  //   askYearsExperience = ( response, convo ) => {
  //     convo.ask( expQuestion, ( response, convo ) => {
  //       convo.say( `looking for candidates with ${ response.text } years experience` );
  //       convo.next();
  //       convo.on( 'end', ( convo ) => {
  //         if ( convo.status === `completed` ){
  //           const res = convo.extractResponses();
  //           console.log( 'res', res );
  //         }
  //       } )
  //     } )
  //   }
  //   bot.startConversation( message, askLocation );
  // } )
    // function to build the attachment
      
      createAttachment = ( arr ) => {
        const reply = [];
        arr.forEach( value => {

    //create skills as string

          const skills = Object.keys( value.skills ).join(", ");

    //function to build and format the websites and assign title link website.

          const formatWebsites = ( obj ) => {
            const formatted = [];
            if( obj.gitHub ){
              formatted.push( "gitHub: " + obj.gitHub );
              value.link = obj.gitHub;
            }
            if( obj.linkedIn ){
              formatted.push( "linkedIn: " + obj.linkedIn );
              value.link = obj.linkedIn;
            }
            if( obj.personalWebsite ){
              formatted.push( "personal Website: " + obj.personalWebsite );
              value.link = obj.personalWebsite;
            }
            else {
              formatted.push( "N/A" );
            }
            return formatted.join("\n");
          }

    //create websites

          const websites = formatWebsites( value );

    //function for formating locations

        const createLocations = ( arr ) => {
          const locs = [];
          arr.forEach( loc => {
            locs.push( loc.city + ", " + loc.state );
          } );
          return locs.join( "\n" )
        }

    //create locations

        const locations = createLocations( value.locations );

    //identify sponsored

          if( value.devMountain ){
              value.sponsored = ":star: *_Sponsored_*:  ";
            }
            else{
              value.sponsored = "";
            }


    //format the attachment reply

        const messageContent = {
            "attachments": [
              {
                "fallback": value.name.firstName + " " + value.name.lastName,
                "pretext": "<" + value.link + "|" + value.sponsored + value.name.firstName + " " + value.name.lastName + ">",
                "mrkdwn_in" : [ "pretext" ],
                "fields": [
                  {
                    "title": "eMail address",
                    "value": value.email,
                    "short": true
                  },
                  {
                    "title": "Years experience:",
                    "value": value.yearsExperience.toString(),
                    "short": true
                  },
                  {
                    "title": "Locations: ",
                    "value": locations,
                    "short": true
                  },
                  {
                    "title": "Skills:",
                    "value": skills,
                    "short": true
                  },
                  {
                    "title": "Websites:",
                    "value": websites + "\n"
                  }
                ]
              }
            ]
          };

    // arrange responses


            if( value.devMountain === true ){
              reply.unshift( messageContent );
              // console.log( 'unshift', reply[0].attachments[0].pretext );
            }
            else if (value.devMountain === false) {
              reply.push( messageContent );
              // console.log( 'push', reply[1].attachments[0].pretext )
            }

        } )
        return reply;
      }

  // controller.hears( [ 'find all students' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
  //   controller.storage.students.all( ( err, allStudents ) => {
  //     if ( err ) {
  //       console.log( 'err', err )
  //     }

  // // create the attachment

  //     const attachment = createAttachment( allStudents );

  // // loop through the attachment and send a reply
      
  //     for (var i = 0; i < attachment.length; i++) {
  //       console.log( 'attachment', attachment[i].attachments[0].pretext )
  //       bot.reply( message, attachment[i] )
  //     }

      
      // let i = 0;
      // do {
      //   setTimeout( () => {
      //     bot.reply( message, attachment[ i ] );
      //     i++;
      //   }, 300 )
      // }
      // while ( i < attachment.length );
    // } )
  // } )

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
