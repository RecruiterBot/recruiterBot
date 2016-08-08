const userRoutes = require( './routes/userRoutes' );
const studentRoutes = require( './routes/studentRoutes' );

module.exports = ( app, passport ) => {

	userRoutes( app, passport );
	studentRoutes( app );

}
