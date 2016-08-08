const mongoose = require( 'mongoose' );

const Users = new mongoose.Schema( {

	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, unique: true }

} );

module.exports = mongoose.model( 'Users', Users );
