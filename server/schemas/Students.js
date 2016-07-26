const mongoose = require( 'mongoose' );
const name = require( './name' );
const location = require( './location' );

const Students = new mongoose.Schema( {

	name,
	address: [ location ],
	email: { type: String, required: true },
	devMountain: { type: Boolean, required: true },
	gitHub: { type: String },
	linkedIn: { type: String },
	gitHubUrl: { type: String },
	personalWebsite: { type: String },
	skills: {},
	campus: { type: String },
	yearsExperience: { type: Number, required: true }

} );

module.exports = mongoose.model( 'Students', Students );
