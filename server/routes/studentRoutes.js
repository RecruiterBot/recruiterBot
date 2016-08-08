const studentCtrl = require( '../ctrls/studentCtrl' );
const userCtrl = require( '../ctrls/userCtrl' );

module.exports = app => {

	app.get( `/api/students`, userCtrl.loggedIn, studentCtrl.getStudents );
	app.put( `/api/students/:id`, userCtrl.loggedIn, studentCtrl.updateStudentById );
	app.post( `/api/students`, userCtrl.loggedIn, studentCtrl.createStudent );
	app.delete( `/api/students/:id`, userCtrl.loggedIn, studentCtrl.deleteStudent );

}
