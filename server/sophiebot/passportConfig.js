const LocalStrategy = require( 'passport-local' ).Strategy;
const Users = require( '../schemas/Users' );


module.exports = passport => {


	//  local login //

	passport.use( 'local-login', new LocalStrategy( ( username, password, done ) => {
		Users.findOne( { 'username': username }, ( err, user ) => {
			if ( err ) {
				return done ( err );
			}
			if ( !user ) {
				return done( null, false, { message: `Incorrect username` } )
			}
			if ( !user.validPassword( password, user.password ) ) {
				return done( null, false, { message: `Incorrect passowrd` } );
			}
			req.logIn( user, err => {
				if( err ) { 
					return res.status( 400 ).json( err ) 
				}
				console.log( 'login user', user )
				return res.status( 200 ).json( user );
			} )
			// return done( null, user );
		} );
	} ) );

	passport.serializeUser( ( user, done ) => {
		console.log( 'serialize user', user )
		done( null, user._id );
	} );

	passport.deserializeUser( ( id, done ) => {
		Users.findById( id, ( err, user ) => {
			if( err ){
				done( err, null );
			}
			console.log( 'deserialize user', user );
			done( null, user );
		} );
	} );
};