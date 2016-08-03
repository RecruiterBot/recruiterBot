module.exports = ( bot, controller ) => {

	controller.hears( [ 'help' ], 'direct_message,direct_mention, mention', ( bot, message ) => {
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
		}
		bot.reply( message, attachment );
	} )

}