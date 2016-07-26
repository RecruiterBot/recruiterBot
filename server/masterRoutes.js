const userRoutes = require( './routes/userRoutes' );
const studentRoutes = require( './routes/studentRoutes' );

module.exports = app => {

	userRoutes( app );
	studentRoutes( app );

}
