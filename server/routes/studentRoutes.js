const studentCtrl = require( '../ctrls/studentCtrl' );

module.exports = app => {

	app.get( `/api/students`, studentCtrl.getStudents );
	app.put( `/api/students/:id`, studentCtrl.updateStudentById );
	app.post( `/api/students`, studentCtrl.createStudent );
	app.delete( `/api/students/:id`, studentCtrl.deleteStudent );

}