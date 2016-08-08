const User = require( '../schemas/Users' );

module.exports = {

	createUser( req, res ) {
		new User( req.body ).save( ( err, newUser ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status(201).json(newUser);
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

	checkEmailDuplicate(req, res, next){
		console.log("checkEmailDuplicate", req.body);
		User.findOne({email: req.body.email}, (err, userFound)=>{
			if (err) {
				return res.status(500).json(err);
			}
			return res.status(200).json(userFound);
		})
	},

	updateAdminInfo(req, res, next){
		console.log(req.body);
		User.findByIdAndUpdate( req.body._id, req.body, { new: true }, ( err, student ) => {
			console.log("STUDENT", student);
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( student );
		} )
	}



}
