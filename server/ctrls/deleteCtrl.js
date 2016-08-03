const attachmentCtrl = require( './attachmentCtrl' );
const Students = require( '../schemas/Students' );

module.exports = ( bot, controller ) => {

	  // deleting candidates from recruitBot database
  controller.hears([`delete`, `remove`], 'direct_message, direct_mention, mention', (bot, message)=>{
    const firstNameQuestion = `Ok, but before that, we need you to verify few information... \n What is your first name?`;
    const lastNameQuestion = `What is your last name?`;
    const emailQuestion = `And lastly, your email?`;
    const confirmDeletionQuestion = `Are you sure you want to delete your profile? (Y/n)`;

    askFirstName = ( response, convo ) => {
      convo.ask( firstNameQuestion, ( response, convo ) => {
        // convo.say(`Ok the first name I have saved is ${ response.text}`)
        askLastName( response, convo );
        convo.next();
      })
    },
    askLastName = ( response, convo ) => {
      convo.ask( lastNameQuestion, ( response, convo ) => {
        // convo.say(`Ok the first name I have saved is ${ response.text}`)
        askEmail( response, convo );
        convo.next();
      })
    }
    askEmail = (response, convo)=>{

      convo.ask(emailQuestion, (response, convo)=>{

            const candidateInfo = convo.extractResponses();

            const firstName = convo.extractResponse(firstNameQuestion);
            const lastName = convo.extractResponse(lastNameQuestion);
            const email = convo.extractResponse(emailQuestion);

            let orIndex =  email.indexOf('|');
            let emailTrimmed = email.slice(8, orIndex);


            Students.find({$and: [{"name.firstName" : firstName }, {"name.lastName" : lastName }, {email: emailTrimmed}]}, (err, studentFound)=>{

              if (studentFound.length === 0) {
                bot.reply(message, `Sorry, I could not find [${firstName} ${lastName}] on recruitBot`);
              }else{
                let studentFoundId = studentFound[0]._id;
                console.log("DELETE >>>>>>>>>>>", studentFound);
                const attachment = attachmentCtrl.createAttachment( studentFound );

                convo.say( attachment[ 0 ] )
                confirmDeletion( response, convo, studentFoundId )
              }
              convo.next();
            })
      })

    }
    confirmDeletion = ( response, convo, studentFoundId )=>{
      convo.ask(confirmDeletionQuestion, (response, convo)=>{
        const confirmation = convo.extractResponse(confirmDeletionQuestion);
        if (confirmation === 'Y') {
          Students.findByIdAndRemove({_id: studentFoundId}, (err, studentRemoved)=>{
            bot.reply(message, "Ok, I deleted your profile from recruitBot");
          })
        }else if(confirmation === 'n'){
          bot.reply(message, "Ok, then, I won't delete your profile");
        }else{
          confirmDeletion(response, convo, studentFoundId);
        }
        convo.next();
      })

    }

    // invoke conversation
    bot.startConversation( message, askFirstName );
  })

}