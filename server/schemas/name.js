const mongoose = require( 'mongoose' );

const name = new mongoose.Schema( {

	firstName: { type: String, required: true },
	lastName: { type: String, required: true }

} );

module.exports = name;