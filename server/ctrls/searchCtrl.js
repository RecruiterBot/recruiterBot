const Students = require( '../schemas/Students' );
const attachmentCtrl = require( './attachmentCtrl' );

module.exports = ( bot, controller ) => {

	controller.hears( [ 'fill', 'position', 'dev', 'developer', 'web developer', 'hire', 'candidate' ], 'direct_message,direct_mention,mention', ( bot, message ) => {
    const locQuestion = `In which city and state is the position located?  Please separate the city and state with a comma.  e.g. Dallas, TX`;
    const skillQuestion = `What skills does the ideal candidate possess?  Please separate each skill with a comma.  e.g. React, Express, Node`;
    const expQuestion = `How many minimum years experience does the ideal candidate need?`;
    const useComma = `Please separate your skills with a comma.  e.g. React, AngularJS, Express`;
    const cityState = `Please include both city and state separated with a comma.  e.g. Dallas, TX`;
    const expectNumber = `Please type the minimum number of years experience required.  e.g. 2`;
    let locArr = "";
    let skillsStrngToArr = "";

    const endConvo = () => {
      bot.reply( message, `Have a nice day!`)
      return convo.stop();
    }

    askLocation = ( response, convo ) => {
      convo.ask( locQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          endConvo();
        }
        if ( response.text.indexOf(",") === -1 ){
          convo.say( cityState );
          setTimeout( () => {
            convo.stop();
            return bot.startConversation( message, askLocation )
          }, 1000);
        }
        if ( response.text.indexOf( "," !== -1 ) ) {
          askSkills( response, convo );
          convo.next();
        }
      } );
    }
    askSkills = ( response, convo ) => {
      convo.ask( skillQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          endConvo();
        }
      if ( response.text.indexOf(",") === -1 ){
          locArr = convo.extractResponse( locQuestion ).split(', ');
          convo.say( useComma );
          setTimeout( () => {
            convo.stop();
            return bot.startConversation( message, askSkills )
          }, 1000);
        }
        askYearsExperience( response, convo );
        convo.next();
      } );
    }
    askYearsExperience = ( response, convo ) => {
      convo.ask( expQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          endConvo();
        }
        const number = Number( response.text );
        if ( isNaN( number ) ) {
          bot.reply( message, expectNumber );
          if( !locArr ) {
              locArr = convo.extractResponse( locQuestion ).split(', ');
            }
          skillsStrngToArr = convo.extractResponse( skillQuestion ).toLowerCase().split(', ');
          setTimeout( () => {
            convo.stop();
            return bot.startConversation( message, askYearsExperience )
          }, 1000);
        } else if( !isNaN( number) ) {
          console.log( 'exp response', response.text );
          convo.next();
          convo.on( 'end', ( convo ) => {
            if ( convo.status === `completed` ){
              console.log( 'convo', convo.responses );
              if( !locArr ) {
                locArr = convo.extractResponse( locQuestion ).split(', ');
              }
              if( !skillsStrngToArr ) {
                skillsStrngToArr = convo.extractResponse( skillQuestion ).toLowerCase().split(', ');
              }

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
                else if( students.length === 0 ){
                  bot.reply( message, `I was unable to find any candidates matching those criteria.  You can try broadening your search.`)
                }

            // create the attachment
                const attachment = attachmentCtrl.createAttachment( students );
                

            // // loop through the attachment and send a reply

                for (var i = 0; i < attachment.length; i++) {
                  bot.reply( message, attachment[i] )
                }
              } )
            }
          } )
        }
      } )
    }
    bot.startConversation( message, askLocation );
  } )


}