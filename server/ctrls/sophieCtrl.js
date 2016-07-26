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

        const locations = createLocations( value.address );

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


            if( value.devMountain ){
              reply.unshift( messageContent )
            }
            else{
              reply.push( messageContent )
            }

        } )
        return reply;
      }

  // create the attachment

      const attachment = createAttachment( allStudents );

  // loop through the attachment and send a reply
      
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
