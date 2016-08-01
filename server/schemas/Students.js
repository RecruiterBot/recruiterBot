const mongoose = require( 'mongoose' );
const location = require( './location' );

const Students = new mongoose.Schema( {

	name:{
		firstName: { type: String },
		lastName: {  type: String} 
	},
	locations: [ location ],
	email: { type: String, unique: true },
	devMountain: { type: Boolean },
	gitHub: { type: String },
	linkedIn: { type: String },
	personalWebsite: { type: String },
	skills: {},
	campus: { type: String },
	yearsExperience: { type: Number }

} );

module.exports = mongoose.model( 'Students', Students );
