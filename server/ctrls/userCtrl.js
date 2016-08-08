const User = require( '../schemas/Users' );
const bcrypt = require( 'bcrypt' );

const generateHash = ( password ) => {
	return bcrypt.hashSync( password, 10  );
}
const validPassword = ( password, hash ) => {
	return bcrypt.compareSync( password, hash );
}

module.exports = {

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
	},
	loggedIn( req, res, next ){
		// console.log( 'req', req );
		if ( req.isAuthenticated() ) {
			console.log( 'is authed', req.isAuthenticated() );
			return next();
		}
		console.log( 'authenticated', req.isAuthenticated() );
		res.redirect( '/' )
	},
	logout( req, res ){
		req.logout();
		res.redirect( '/' )
	}



}
