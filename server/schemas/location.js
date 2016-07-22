const mongoose = require( 'mongoose' );

const location = new mongoose.Schema( {

	city: { type: String, required: true },
	state: { type: String, required: true, minLength: 2, maxLength: 2 },
	zip: { type: Number, minLength: 5, maxLength: 9 }

} );

module.exports = location;