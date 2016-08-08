const User = require( '../schemas/Users' );

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
		// req.body.password = generateHash( req.body.password );
		new User( req.body ).save( ( err, newUser ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			req.logIn( newUser, err => {
				if( err ) { 
					return res.status( 400 ).json( err ) 
				}
				return res.status( 200 ).json( newUser );
			} )
		} )
	},

	loggedIn( req, res, next ){
		if ( req.isAuthenticated() ) {
			return next();
		}
		res.redirect( '/' )
	},

	logout( req, res ){
		req.logout();
		res.redirect( '/' )
	},

	checkEmailDuplicate(req, res, next){
		console.log("checkEmailDuplicate", req.body);
		User.findOne({email: req.body.email}, (err, userFound)=>{
			if (err) {
				return res.status(500).json(err);
			}
			return res.status(200).json(userFound);
		})
	}



}
