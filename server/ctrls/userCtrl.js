const User = require( '../schemas/Users' );

module.exports = {

	login( req, res ) {
		console.log(req.body);
		User.findOne( { 'username': req.body.username }, req.body, { new: false }, ( err, user ) => {
			console.log(user);
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			else if( !user ){
				return res.status( 200 ).json( {error: `Username not found`} );
			}
			else if ( req.body.password !== user.password ) {
				return res.status( 200 ).json( {error: `Incorrect password`} );
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
		console.log("Body", req.body);
		new User( req.body ).save( ( err, newUser ) => {
			console.log("newUser", newUser);
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 201 ).json( newUser );
		} )
	}



}
