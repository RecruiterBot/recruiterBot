const mongoose = require( 'mongoose' );
const location = require( './location' );

const Students = new mongoose.Schema( {

	name:{
		firstName: { type: String, required: true },
		lastName: {  type: String, required: true} 
	},
	locations: [ location ],
	email: { type: String, required: true },
	devMountain: { type: Boolean, required: true },
	gitHub: { type: String },
	linkedIn: { type: String },
	personalWebsite: { type: String },
	skills: {},
	campus: { type: String },
	yearsExperience: { type: Number }

} );

module.exports = mongoose.model( 'Students', Students );
