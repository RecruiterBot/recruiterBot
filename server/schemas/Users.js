const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcrypt-nodejs' );

const Users = new mongoose.Schema( {

	username: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, unique: true, required: true }

} );

Users.methods.generateHash = ( password ) => {
    return bcrypt.hashSync( password, bcrypt.genSaltSync( 10 ), null );
};

Users.methods.validPassword = ( password, user ) => {
    return bcrypt.compareSync( password, user );
};


module.exports = mongoose.model( 'Users', Users );
