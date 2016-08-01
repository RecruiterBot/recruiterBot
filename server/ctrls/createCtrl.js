const Students = require( '../schemas/Students' );
const attachmentCtrl = require( './attachmentCtrl' );

module.exports = ( bot, controller ) => {

controller.hears( ['job','looking for a job', 'I need a job','connect me with employer'],'direct_message,direct_mention,mention', ( bot, message ) => {
    // convo.say(`Excellent I can help you with that I'll ask you some questions and save that information so a recruiter can contact you with open positions.`);
    const firstNameQuestion = `Excellent, I can help you with that. I'll need to ask you some questions and save that information, so a recruiter can contact you with open positions. Let's get started... \n What is your first name? (e.g., 'Jack')`;
    const lastNameQuestion = `What is your last name? (e.g., 'Daniels')`;
    const locationsQuestion = `In what cities and states are you looking for a position? (e.g., 'Dallas, TX / Queens, NY') \n NOTE: \n 1. separate city and state with a comma \n 2. separate locations with a slash`
    const emailQuestion = `What is your email? (e.g., 'jdaniels@gmail.com')`;
    const githubQuestion = `Do you have GitHub? if so, paste in your GitHub URL. If no, type "no"`;
    const linkedinQueston = `Do you have LinkedIn? if so, paste in your LinkedIn URL. If no, type "no"`;
    const personalWebsiteQuestion = `Do you have a personal website? if so, paste link in. If no, type "no"`;
    const skillsQuestion = `What skills do you have? (e.g., 'javascript, html5, angular' etc. ) \n Note: separate skills with a comma`

    let firstName = "";
    let lastName = "";
    let locations = "";

    askFirstName = ( response, convo ) => {
      convo.ask( firstNameQuestion, ( response, convo ) => {
        response.text = response.text.trim();

        if (response.text.indexOf(' ') !== -1) {
          bot.reply(message, `[Oops!] Your first name must not contain any spaces`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askFirstName ); 
          }, 1000);
          
        }else{
           firstName = capitalizeFirstLetterOfName(response.text)
           convo.say(`Ok, the first name I have saved is ${firstName}`)
           askLastName( response, convo );
           convo.next();
        }

       
      })
    }
    askLastName = ( response, convo) => {
      convo.ask( lastNameQuestion, ( response, convo ) => {
        response.text = response.text.trim();

        if (response.text.indexOf(' ') !== -1) {
          bot.reply(message, `[Oops!] Your last name must not contain any spaces`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askLastName ); 
          }, 1000);
          
        }else{
           lastName = capitalizeFirstLetterOfName(response.text)
           convo.say(`Ok, the first name I have saved is ${lastName}`)
           askLocations( response, convo );
           convo.next();
        }

       
      })
    }
    askLocations = ( response, convo ) => {
      convo.ask( locationsQuestion, ( response, convo ) => {

         if (!locationsIsFormatted(response.text)) {
          bot.reply(message, `[Oops!] Please enter locations in a correct format`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askLocations ); 
          }, 1000);
          
        }else{
          locations = locationsFormatted(response.text);
          convo.say(`Ok, the locations I have saved are ${locations}`)
          askEmail (response, convo );
          convo.next();
        }

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


    // local functions for formatting 
    capitalizeFirstLetterOfName = (name)=>{
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    locationsIsFormatted = (locations)=>{
      let locationsArray = locations.split('/');
      console.log(locationsArray);
      for(let i=0; i<locationsArray.length; i++){
        locationsArray[i] = locationsArray[i].trim();
        if(locationsArray[i].indexOf(',') === -1){
          return false;
        }
      }
      return true;
    } 
    locationsFormatted = (locations)=>{
      let locationsArray = locations.split('/');
      console.log(locationsArray);
      for(let i=0; i<locationsArray.length; i++){
        locationsArray[i] = locationsArray[i].trim();
      }
      return locationsArray;
    }  

    // string.charAt(0).toUpperCase() + string.slice(1);




          // invoke conversation //

    bot.startConversation( message, askFirstName );
  } )


	

}