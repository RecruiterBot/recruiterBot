const User = require( '../schemas/Users' );

module.exports = {

	login( req, res ) {
		User.findOne( { 'userName': req.body.userName }, req.body, { new: false }, ( err, user ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			else if( !user ){
				return res.status( 401 ).send( `user name not found` );
			}
			else if ( req.body.password !== user.password ) {
				return res.status( 401 ).send( `incorrect password` );
			}
			return res.status( 200 ).json( user );
		} )
	},

	updateEmail( req, res ) {
		User.findByIdAndUpdate( '579285b747eeca3e64bd45fb', { $push: { 'email': req.body.email } }, { new: true }, ( err, user) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( user );
		} )
	}

	, createUser( req, res ) {
		new User( req.body ).save( ( err, newUser ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 201 ).json( newUser );
		} )
	}



}
