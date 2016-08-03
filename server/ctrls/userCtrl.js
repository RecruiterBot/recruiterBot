const User = require( '../schemas/Users' );
const bcrypt = require( 'bcrypt' );

const generateHash = ( password ) => {
	return bcrypt.hashSync( password, 10  );
}
const validPassword = ( password, hash ) => {
	return bcrypt.compareSync( password, hash );
}

module.exports = {

	login( req, res ) {
		User.findOne( { 'username': req.body.username }, req.body, { new: false }, ( err, user ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			else if( !user ){
				return res.status( 200 ).json( {error: `Username not found`} );
			}
			else if ( validPassword( req.body.password, user.password ) === false ) {
				return res.status( 200 ).json( {error: `Incorrect password`} );
			}
			console.log( 'user', user )
			return res.status( 200 ).json( user );
		} )
	},

	updateEmail( req, res ) {
		User.findByIdAndUpdate( '57a2671bbed7c53698dacb5d', { $push: { 'email': req.body.email } }, { new: true }, ( err, user) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( user );
		} )
	},

	createUser( req, res ) {
		req.body.password = generateHash( req.body.password );
		new User( req.body ).save( ( err, newUser ) => {
			console.log("newUser", newUser);
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 201 ).json( newUser );
		} )
	}



}
