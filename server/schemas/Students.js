const mongoose = require( 'mongoose' );
const location = require( './location' );

const Students = new mongoose.Schema( {

	name:{
		firstName: { type: String, required: true},
		lastName: {  type: String, required: true} 
	},
	locations: [ location ],
	email: { type: String, unique: true, required: true },
	devMountain: { type: Boolean },
	gitHub: { type: String },
	linkedIn: { type: String },
	personalWebsite: { type: String },
	skills: {},
	campus: { type: String },
	yearsExperience: { type: Number, required: true },
	createdAt: {type: Date, default: new Date()} 

} );

module.exports = mongoose.model( 'Students', Students );
