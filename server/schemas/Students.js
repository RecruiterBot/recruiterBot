const mongoose = require( 'mongoose' );
const name = require( './name' );
const location = require( './location' );

const Students = new mongoose.Schema( {

	name,
	location: [ location ],
	email: { type: String, required: true },
	devMountain: { type: Boolean, required: true },
	linkedIn: { type: String },
	personalWebsite: { type: String },
	skills: {},
	campus: { type: String },
	yearsExperience: { type: Number }

} );

module.exports = mongoose.model( 'Students', Students );