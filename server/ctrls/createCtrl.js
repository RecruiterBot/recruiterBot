const Students = require( '../schemas/Students' );
const attachmentCtrl = require( './attachmentCtrl' );

module.exports = ( bot, controller ) => {


controller.hears( ['job', 'recruiter', 'connect me with employer', 'add'],'direct_message,direct_mention,mention', ( bot, message ) => {
    // convo.say(`Excellent I can help you with that I'll ask you some questions and save that information so a recruiter can contact you with open positions.`);
    const firstNameQuestion = `Excellent, I can help you with that. I'll need to ask you some questions and save that information, so a recruiter can contact you with open positions. Let's get started... \n What is your first name? (e.g., 'Jack')`;
    const lastNameQuestion = `What is your last name? (e.g., 'Daniels')`;
    const locationsQuestion = `In what cities and states are you looking for a position? (e.g., 'Dallas, TX / Queens, NY') \n NOTE: \n 1. separate city and state with a comma \n 2. separate locations with a slash`
    const emailQuestion = `What is your email? (e.g., 'jdaniels@gmail.com')`;
    const githubQuestion = `Do you have GitHub? if so, paste in your GitHub URL. If no, type "no" (e.g., 'https://github.com/abcde')`;
    const linkedinQueston = `Do you have LinkedIn? if so, paste in your LinkedIn URL. If no, type "no" (e.g., 'https://www.linkedin.com/in/abcde')`;
    const personalWebsiteQuestion = `Do you have a personal website? if so, paste link in. If no, type "no" (e.g., https://www.myprofileurl.com)`;
    const skillsQuestion = `What skills do you have? (e.g., 'javascript, html5, angular' etc. ) \n NOTE: separate skills with a comma`
    const yearsOfExperienceQuestion =`How many years of technical experience do you have? (e.g., '3') \n NOTE: must be a whole number`
    const profileSubmitConfirmation = `Awesome! Thank you for providing all the information. I am just about ready to submit your profile as a recruitBot candidate. \n Are you sure you want me to go ahread and save your profile? (Y/n)`

    const endConvo = ( convo ) => {
        bot.reply( message, `Have a nice day!`)
        return convo.stop();
      }
      
    let firstName = "";
    let lastName = "";
    let locations = "";
    let email = "";
    let githubUrl = "";
    let linkedinUrl = "";
    let persoanlWebsiteUrl = "";
    let skills = "";
    let yearsOfExperience = "";

    askFirstName = ( response, convo ) => {
      convo.ask( firstNameQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
        response.text = response.text.trim();

        if (response.text.indexOf(' ') !== -1) {
          bot.reply(message, `[Oops!] Your first name must not contain any spaces`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askFirstName ); 
          }, 1000);
          
        }else{
           firstName = capitalizeFirstLetterOfName(response.text)
           convo.say(`Ok, the first name I have saved is [${firstName}]`)
           firstName = response.text.toLowerCase();
           askLastName( response, convo );
           convo.next();
        }

       
      })
    }
    askLastName = ( response, convo) => {
      convo.ask( lastNameQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
        response.text = response.text.trim();

        if (response.text.indexOf(' ') !== -1) {
          bot.reply(message, `[Oops!] Your last name must not contain any spaces`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askLastName ); 
          }, 1000);
          
        }else{
           lastName = capitalizeFirstLetterOfName(response.text)
           convo.say(`Ok, the last name I have saved is [${lastName}]`)
           lastName = response.text.toLowerCase();
           askLocations( response, convo );
           convo.next();
        }

       
      })
    }
    askLocations = ( response, convo ) => {
      convo.ask( locationsQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }

         if (!locationsIsFormatted(response.text)) {
          bot.reply(message, `[Oops!] Please enter locations in the correct format`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askLocations ); 
          }, 1000);
          
        }else{
          locations = locationsFormatted(response.text);
          convo.say(`Ok, the locations I have saved are [${locations}]`)
          askEmail (response, convo );
          convo.next();
        }

      })
    }
    askEmail = ( response, convo ) => {
      convo.ask( emailQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }

        if (!isEmailFormat(response.text)) {
          bot.reply(message, `[Oops!] Please enter your email in the correct format`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askEmail ); 
          }, 1000);
          
        }
        emailTaken( response, convo, response.text );
      })
    }
    askGithub = ( response, convo ) => {
      convo.ask( githubQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
        if(response.text === "no"){
          askLinkedin ( response, convo );
          convo.next();
        } else {
            if (!response.text.includes('http') || response.text.indexOf(' ') !== -1) {
              bot.reply(message, `[Oops!] Please enter the github url in correct format`);
              convo.stop();
              setTimeout(function(){ 
                bot.startConversation( message, askGithub ); 
              }, 1000);
            }else{
              githubUrl = linkFormatter(response.text);
              convo.say(`Great, the github URL I have of you is [${ githubUrl }]`)
                askLinkedin ( response, convo );
                convo.next();
              }
            }
      })
    }
    askLinkedin = ( response, convo ) => {
      convo.ask( linkedinQueston, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
        if(response.text === "no"){
          askPersonalWebsite ( response, convo );
          convo.next();
        } else {
            if (!response.text.includes('http') || response.text.indexOf(' ') !== -1) {
              bot.reply(message, `[Oops!] Please enter the linkedin url in correct format`);
              convo.stop();
              setTimeout(function(){ 
                bot.startConversation( message, askLinkedin ); 
              }, 1000);
            }else{
              linkedinUrl = linkFormatter(response.text);
              convo.say(`Great, the linkedin URL I have of you is [${ linkedinUrl }]`)
                askPersonalWebsite ( response, convo );
                convo.next();
              }
            }
      })
    }
    askPersonalWebsite = (response, convo ) => {
      convo.ask( personalWebsiteQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
          if(response.text === "no"){
            askSkills ( response, convo );
            convo.next();
          } else {
              if (!response.text.includes('http') || response.text.indexOf(' ') !== -1) {
                bot.reply(message, `[Oops!] Please enter the personal website url in correct format`);
                convo.stop();
                setTimeout(function(){ 
                  bot.startConversation( message, askPersonalWebsite ); 
                }, 1000);
              }else{
                persoanlWebsiteUrl = linkFormatter(response.text);
                convo.say(`Great, the personal website URL I have of you is [${ persoanlWebsiteUrl }]`)
                  askSkills ( response, convo );
                  convo.next();
                }
              }
      })
    }
    askSkills = ( response, convo ) => {
      convo.ask( skillsQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
          if(!skillsIsFormatted(response.text)){
            bot.reply(message, `[Oops!] Please list your skills in the correct format`);
            convo.next();
          }else{
            skills = response.text.trim();
            convo.say(`Great, skills I have of you are [${ skills }]`)
            askYearsOfExperience(response, convo);
            convo.next();
          }
      })
    }
    askYearsOfExperience = ( response, convo ) => {
      convo.ask( yearsOfExperienceQuestion, ( response, convo ) => {
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
          if(!yearsOfExperienceFormatted(response.text)){
            bot.reply(message, `[Oops!] Please enter an interger for your years of experience`);
            convo.next();
          }else{
            yearsOfExperience = response.text.trim();
            convo.say(`Great, the years of expererience you indicated is [${ yearsOfExperience }]`)
            saveProfileConfirmation(response, convo);
            convo.next();
          }
      })
    }
    saveProfileConfirmation = (response, convo)=>{
      convo.ask(profileSubmitConfirmation, (response, convo)=>{
        if ( attachmentCtrl.checkResponse( response, convo ) === false ) {
          return endConvo( convo );
        }
        if (response.text === 'Y') {
          bot.reply(message, `Ok, I saved your profile on recruitBot`);
          let candidate = formatCandidateProfile();

          // add candidate to database
          new Students( candidate ).save( ( err, newStudent ) => {
            if ( err ) {
              console.log(err);
            }else{
              Students.findById(newStudent._id, (err, studentFound)=>{
                if (studentFound.length === 0) {
                  bot.reply(message, `Sorry, I could not find you on recruitBot`);
                }else{
                  const attachment = attachmentCtrl.createAttachment( [studentFound] );
                  convo.say(attachment[0]);
                }
                convo.next();
              })
            }
          });

        }else if(response.text === 'n'){
          bot.reply(message, `Ok, I won't add your profile to recruitBot`);
          convo.stop();
        }else{
          saveProfileConfirmation(response, convo);
          convo.next();
        }
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
        if (i !== locationsArray.length-1) {
          locationsArray[i] = locationsArray[i] + " / "
        }
      }
      return locationsArray.join('');
    }  

    isEmailFormat = (email)=>{
      if ((email.indexOf('@') === -1) || (email.indexOf(' ') !== -1)) {
        return false;
      }
      return true;
    }
    emailTaken = ( response, convo, candEmail)=>{
      candEmail = emailFormatter(candEmail);
      Students.find({email: candEmail.toLowerCase()}, (err, emailExists)=>{
        if (err) {
          return false;
        }
        if( emailExists.length === 0 ){
          email = candEmail;
          convo.say(`Ok, the email I have saved is [${ candEmail }]` )
          askGithub ( response, convo );
          convo.next();
        } else {
          bot.reply(message, `[Oops!] ${candEmail} is aleady taken. Enter a different email...`);
          convo.stop();
          setTimeout(function(){ 
            bot.startConversation( message, askEmail ); 
          }, 1000);
        
        }
      })
    }

    emailFormatter = (email)=>{
      let orIndex =  email.indexOf('|');
      let emailTrimmed = email.slice(8, orIndex).toLowerCase();
      return emailTrimmed;
    }

    linkFormatter = (link)=>{
      let orIndex =  link.indexOf('|');
      let linkTrimmed = link.slice(1, orIndex);
      return linkTrimmed;
    } 

    skillsIsFormatted = (skills)=>{
      if (skills.length === 0) {
        return false;
      }
      return true;
    }

    yearsOfExperienceFormatted = (yearsOfExperience)=>{
      if (isNaN(yearsOfExperience.trim())) {
        return false;
      }
      return true;
    }

    formatCandidateProfile = ()=>{
       let candidate = {};
       candidate.name = {}; 
       candidate.name.firstName = firstName;
       candidate.name.lastName = lastName;
       candidate.locations = locationsFormatter(locations);
       candidate.email = email;
       if (githubUrl.length > 0) {
          candidate.gitHub = githubUrl;
       }
       if (linkedinUrl.length > 0) {
          candidate.linkedIn = linkedinUrl;
       }
       if (persoanlWebsiteUrl.length > 0) {
       candidate.personalWebsite = persoanlWebsiteUrl;
       }
       candidate.skills = skillsFormatter(skills);
       candidate.yearsExperience = parseInt(yearsOfExperience);

       console.log("CANDIDATE", candidate);
       return candidate;
    }

    skillsFormatter = (skills) =>{
        let skillsToArray = skills.split(',');
        
        console.log(skillsToArray);
        
        skills = {};
        
        // trim each skill, lowercase, add it as a skills property
        for(let i=0; i<skillsToArray.length; i++){
          skillsToArray[i] = skillsToArray[i].trim().toLowerCase();
          skills[skillsToArray[i]] = skillsToArray[i];
        }
        
        return skills;
    }

    locationsFormatter = (locations)=>{
      locationsToArray = locations.split('/');
      
      console.log(locationsToArray);
      
      let locationsFormatted = [];
      
      // turn array of locations into array of location objects
      for(let i=0; i<locationsToArray.length; i++){
        locationsToArray[i] = locationsToArray[i].trim().toLowerCase();
        
        locationsToArray[i] = locationsToArray[i].split(',');
        
        locationsToArray[i][0] = locationsToArray[i][0].trim();
        locationsToArray[i][1] = locationsToArray[i][1].trim();
        
        // put each string locations into location objects
        let newLocationObj = {};
        newLocationObj.city = locationsToArray[i][0];
        newLocationObj.state = locationsToArray[i][1];

        // push newLocationObj into locationsFormatted
        locationsFormatted.push(newLocationObj);
      }
      
      return locationsFormatted;
    }

    // string.charAt(0).toUpperCase() + string.slice(1);




          // invoke conversation //

    bot.startConversation( message, askFirstName );
  } )


	

}