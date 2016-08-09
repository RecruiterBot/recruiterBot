const userCtrl = require( '../ctrls/userCtrl' );

module.exports = ( app, passport ) => {

	app.put( `/api/admin/login`, ( req, res, next ) => {
      passport.authenticate( 'local-login', ( err, user ) => {
        if ( err ) {
	        return next( err );  
	      } else {
	      req.logIn( user, err => {
				if( err ) { 
					return res.status( 400 ).json( err ) 
				}
        	console.log("authenticateERR", user);
				return res.status( 200 ).json( user );
			} ) 
	      }
	    } )( req, res, next ); 
	  });
	app.get( `/api/logout`, userCtrl.logout );
	// app. put( `/api/admin/email`, userCtrl.loggedIn, userCtrl.updateEmail );
	app.put( `/api/admin`, userCtrl.createUser );
	app.put( `/api/admin/checkEmailDuplicate`, userCtrl.checkEmailDuplicate);
	app.put( `/api/admin/updateAdminInfo`, userCtrl.updateAdminInfo )
}
