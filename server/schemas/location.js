const mongoose = require( 'mongoose' );

const location = new mongoose.Schema( {

	city: { type: String, required: true },

	state: { type: String, required: true },

	zip: { type: String, minLength: 5, maxLength: 9 }

} );

module.exports = location;