module.exports = {

    createAttachment( arr ) {
        const reply = [];
        arr.forEach( value => {

    //create skills as string

          const skills = Object.keys( value.skills ).join(", ").replace(/\b\w/g, l => l.toUpperCase() );

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
            locs.push( loc.city.replace(/\b\w/g, l => l.toUpperCase() ) + ", " + loc.state.toUpperCase() );
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

		    capitalizeFirstLetterOfName = ( name ) => {
		      return name.charAt( 0 ).toUpperCase() + name.slice( 1 );
		    }

    	value.name.firstName = capitalizeFirstLetterOfName( value.name.firstName );
    	value.name.lastName = capitalizeFirstLetterOfName( value.name.lastName );

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

    console.log( 'message', messageContent );

            if( value.devMountain === true ){
              reply.unshift( messageContent );
              console.log("unshift", reply)
              // console.log( 'unshift', reply[0].attachments[0].pretext );
            }
            else if (!value.devMountain) {
              reply.push( messageContent );
              // console.log( 'push', reply[1].attachments[0].pretext )
            }

        } )
        return reply;
      },
      checkResponse( response, convo ){
      	const attachment = {
			"attachments": [
				{
					"pretext": "_*Conversation Options*_",
					"mrkdwn_in": [ "pretext", "fields[0].title" ],
					"color": "#36a64f",
					"fields": [
						{
							"title": "Recruiters Options",
							"value": "-------\nFill a position.\nHire someone.\nFind a candidate.\nI'm looking for a developer."
						},
						{
							"title": "Candidates looking for a job options",
							"value": "-------\nI'm looking for a job.\nConnect me with a recruiter.\nAdd me to the system.",
							"short": true
						},
						{
							"title": "Candidate, no longer looking for a job",
							"value": "-------\nRemove me from the system.\nDelete my profile.",
							"short": true
						},
						{
							"title": "Canceling conversations Options",
							"value": "-------\nCancel\tEnd\nStop\t\tQuit\nDone"
						}
					]
				}
			]
		};
      	if( response.text.toLowerCase() === "help" ){
      		convo.say( attachment );
      		return response;
      	}
      	let check = [];
      	if( response.text.indexOf( " " ) === -1 ) {
	      	check.push( response.text.toLowerCase() );
	      } else {
	      	check = response.text.toLowerCase().split( " " );
	      }
      	check.forEach( value => {
      		if( value === "cancel" || value === "quit" || value === "end" || value === "restart" || value === "over" || value === "mistake" || value === "done" || value === "stop" || value === "finished" ) {
      			return check = true;
      		}
      	} )
      	if ( check === true ) {
      		return false;
      	}
      	return response
      }

}