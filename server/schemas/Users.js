const mongoose = require( 'mongoose' );

const Users = new mongoose.Schema( {

	userName: { type: String, required: true },
	password: { type: String, required: true },
	email: [ { type: String, unique: true } ]

} );

module.exports = mongoose.model( 'Users', Users );