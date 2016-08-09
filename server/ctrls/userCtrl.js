const User = require( '../schemas/Users' );

module.exports = {

	updateEmail( req, res ) {
		User.findByIdAndUpdate( req.body._id, { $push: { 'email': req.body.email } }, { new: true }, ( err, user) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( user );
		} )
	},

	createUser( req, res ) {
		let newUser = new User( req.body )
		newUser.password = newUser.generateHash( req.body.password );
		newUser.save( ( err, createdUser ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			req.logIn( createdUser, err => {
				if( err ) { 
					return res.status( 400 ).json( err ) 
				}
				return res.status( 200 ).json( createdUser );
			} )
		} )
	},

	loggedIn( req, res, next ){
		if ( req.isAuthenticated() ) {
			return next();
		} else {
			return res.status( '401' ).send( 'user not logged in' )
		}
	},

	logout( req, res ){
		req.logout();
		res.redirect( '/' )
	},

	checkEmailDuplicate( req, res, next ){
		User.findOne( { email: req.body.email }, ( err, userFound ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( userFound );
		})
	}



}
