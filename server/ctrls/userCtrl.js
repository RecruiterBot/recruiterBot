const User = require( '../schemas/Users' );

module.exports = {

	createUser( req, res ) {

		let newUser = new User( req.body );
		newUser.password = newUser.generateHash(req.body.password);
		newUser.save( ( err, userCreated ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status(201).json(userCreated);
		} )
	},

	loggedIn( req, res, next ){
		if ( req.isAuthenticated() ) {
			return next();
		} else {
			return res.status( '401' ).send( 'user not logged in' )
		}
	},

	logout( req, res, next ){
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
	},

	updateAdminInfo(req, res, next){
		console.log(req.body);
		User.findById( req.body._id, ( err, found ) => {
			console.log("JUST FOUND >>>>>>>", found);
			found.password = found.generateHash( req.body.password );
			found.username = req.body.username;
			found.email = req.body.email;
			console.log("FOUND >>>>>>", found);
			User.findByIdAndUpdate( found._id, found, { new: true }, ( err, newAdmin ) => {
				console.log("STUDENT", newAdmin);
				if ( err ) {
					return res.status( 500 ).json( err );
				}
				return res.status( 200 ).json( newAdmin );
			} )
		} )
	}



}
