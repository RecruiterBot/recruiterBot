const Students = require( '../schemas/Students' );

module.exports = ( ApiaiBotkit, Botkit, app, mongoURI ) => {

  // const apiToken = require( '../sophiebot/config' ).apiToken;
  const controller = Botkit.slackbot();

  const bot = controller.spawn( {
    token: require( '../sophiebot/config' ).botToken
  } );

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



  controller.hears( ['looking for a job', 'I need a job','connect me with employer'],'direct_message,direct_mention,mention', ( bot, message ) => {
    // convo.say(`Excellent I can help you with that I'll ask you some questions and save that information so a recruiter can contact you with open positions.`);
    const firstNameQuestion = `Excellent I can help you with that I'll ask you some questions and save that information so a recruiter can contact you with open positions. What is your first name?`;
    const lastNameQuestion = `What is your last name?`;
    const locationsQuestion = `In what city and state are you looking for a position?`
    const emailQuestion = `What is your email?`;
    const githubQuestion = `Do you have a github? if so paste link in. If no type "no"`;
    const linkedinQueston = `Do you have a linkedIn vanity URL? if so paste link in. If no type "no"`;
    const personalWebsiteQuestion = `Do you have a personal website? if so past link in. If no typoe "no"`;
    const skillsQuestion = `What skills do you have?`

    askFirstName = ( response, convo ) => {
      convo.ask( firstNameQuestion, ( response, convo ) => {
        convo.say(`Ok the first name I have saved is ${ response.text}`)
        askLastName( response, convo );
        convo.next();
      })
    }
    askLastName = ( response, convo) => {
    convo.ask( lastNameQuestion, ( response, convo ) => {
      convo.say( `Ok the last name I have saved is ${ response.text}` )
      askLocations( response, convo );
      convo.next();
    })
    }
    askLocations = ( response, convo ) => {
      convo.ask( locationsQuestion, ( response, convo ) => {
        convo.say(`Ok the location I have saved is ${ response.text }`)
        askEmail (response, convo );
        convo.next();
      })
    }
    askEmail = ( response, convo ) => {
      convo.ask( emailQuestion, ( response, convo ) => {
        convo.say(`Ok the email I have saved is ${ response.text }` )
        askGithub ( response, convo );
        convo.next();
      })
    }
    askGithub = ( response, convo ) => {
      convo.ask( githubQuestion, ( response, convo ) => {
        if(response.text === "no"){
          askLinkedin ( response, convo );
          convo.next();
        } else {
      convo.say(` Great, the github URL I have for you is ${ response.text }`)
        askLinkedin ( response, convo );
        convo.next();
      }
      })
    }
    askLinkedin = ( response, convo ) => {
      convo.ask( linkedinQueston, ( response, convo ) => {
        if( response.text === "no"){
          askPersonalWebsite( response, convo )
          convo.next();
        } else {
          convo.say(`Excellent! almost done, the LinkedIn Vanity URL I have saved is ${ response.text }`)
          askPersonalWebsite( response, convo )
          convo.next();
        }
      } )
    }
    askPersonalWebsite = (response, convo ) => {
    convo.ask( personalWebsiteQuestion, ( response, convo ) => {
        if( response.text === "no"){
          askSkills( response, convo )
        } else {
          convo.say(`Ok the personal website I have save is ${ response.text }`)
          askSkills( response, convo )
          convo.next();
        }
    })
    }
    askSkills = ( response, convo ) => {
      convo.ask( skillsQuestion, ( response, convo ) => {
          let skills = []
        for (var i = 0; i<skills.length; i++){
          if (response.text == 'javaScript'){
            skills.push ('javaScript');
          }else if ( response.text == 'Angular'){
              skills.push('Angular')
            }
            else if ( response.text == 'React'){
              skills.push('React')
            }
          }
          convo.next();
          convo.on(`end`, (convo) => {
            if(convo.status === `completed` ){
              const savedStudentInfo = convo.extractResponses();

              const savedFirstName = convo.extractResponse(firstNameQuestion )
              const savedLastName =
              convo.extractResponse( lastNameQuestion )
              //  console.log( 'student', savedStudentInfo )
              const savedLocations = convo.extractResponse( locationsQuestion )
              const savedEmail = convo.extractResponse(
                emailQuestion )
                const savedSkills = convo.extractReponse( skillsQuestion )

                const studentObj = {
                  "name": {
                    "firstName": savedFirstName,
                    "lastName": savedLastName
                  },
                  "locations": savedLocations,
                  "email": savedEmail,
                  "skills": {savedSkills}
                };

              }

            })
          return skills;
      })
    }




          // invoke conversation //

    bot.startConversation( message, askFirstName );
  } )



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
            if( !obj.gitHub && !obj.linkedIn && !obj.personalWebsite ) {
              formatted.push( "N/A" );
              value.link = `https://www.google.com#q=${ obj.name.firstName }+${ obj.name.lastName }`
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


  controller.hears( [ 'fill', 'position', 'dev', 'developer', 'web developer', 'hire' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
    const locQuestion = `In which city and state is the position located?`;
    const skillQuestion = `What skills does the ideal candidate possess?`;
    const expQuestion = `How many years experience does the ideal candidate need?`;

    askLocation = ( response, convo ) => {
      convo.ask( locQuestion, ( response, convo ) => {
        convo.say(`looking for candidates in ${ response.text }` );
        askSkills( response, convo );
        convo.next();
      } );
    }
    askSkills = ( response, convo ) => {
      convo.ask( skillQuestion, ( response, convo ) => {
        convo.say( `looking for candidates with experience in ${ response.text }` );
        askYearsExperience( response, convo );
        convo.next();
      } );
    }
    askYearsExperience = ( response, convo ) => {
      convo.ask( expQuestion, ( response, convo ) => {
        convo.say( `looking for candidates with ${ response.text } years experience` );
        convo.next();
        convo.on( 'end', ( convo ) => {
          if ( convo.status === `completed` ){
            const locArr = convo.extractResponse( locQuestion ).split(', ');
            const skillsStrngToArr = convo.extractResponse( skillQuestion ).toLowerCase().split(', ')

            const exp = Number( convo.extractResponse( expQuestion ) );

            const location = {};
            location.city = locArr[ 0 ].toLowerCase();
            location.state = locArr[ 1 ].toLowerCase();

            const skillsArr = [];
            skillsStrngToArr.forEach( value => {
              if( value === "js" ){
                value = "javascript"
              }
              const name = 'skills.' + value;
              skillsArr.push( { 
                [ name ]: {
                  $exists: true
                }
              } );
            } )

            console.log( 'skills', skillsArr );

            Students.find(
              { $and: [
                { locations: { $elemMatch: { city: location.city, state: location.state } } },
                { yearsExperience: { $gte: exp } },
                { $or: skillsArr }
                ]
              },
               ( err, students ) => {
              if( err ) {
                console.log( 'err', err );
              }
              console.log( 'students', students )

          // create the attachment

              const attachment = createAttachment( students );
              console.log( 'attachment', attachment )

          // // loop through the attachment and send a reply

              for (var i = 0; i < attachment.length; i++) {
                bot.reply( message, attachment[i] )
              }
            } )
          }
        } )
      } )
    }
    bot.startConversation( message, askLocation );
  } )

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


  // controller.hears( ["sophie", "I need a web developer", "good ones", /^.{0.}sophie.{0.}$/ ], [ "direct_message", "ambient" ], ( bot, message ) => {
  //   if( message.text === "sophie" ){
  //     bot.reply( message,'What can I do for you, ?' );
  //   }
  //   else if ( message.text ==="I need a web developer" ){
  //     bot.reply( message, 'Keep calm I can help you with that. What kind of developer are you looking for?' )
  //   }
  //   else if ( message.text === "good ones" ){
  //     bot.reply( message, 'Ok, excellent, here is what you need.' )
  //   }
  //   else {
  //     bot.reply( message, "I only speak a few phrases right now, try me out late." );
  //   }
  // } );

  bot.startRTM( ( err, bot, payload ) => {
    if ( err ) {
      console.log( err )
      throw new Error( 'Could not connect to Slack' );
    }

  } );
}
