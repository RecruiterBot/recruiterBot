const mongoose = require( 'mongoose' );

const location = new mongoose.Schema( {

	city: { type: String, required: true },

	state: { type: String, required: true },

} );

module.exports = location;
