const Student = require( '../schemas/Students' );

module.exports = {

	getStudents( req, res ) {
		Student.find( { }, ( err, students ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( students );
		} )
	},

	updateStudentById( req, res ) {
		console.log("BODY", req.body);
		Student.findByIdAndUpdate( req.params.id, req.body, { new: true }, ( err, student ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( student );
		} )
	},

	createStudent( req, res ) {
		console.log("NEW STUDENT >>>>>>>>", req.body);
		new Student( req.body ).save( ( err, newStudent ) => {
			console.log(">>>>>>>>>>>>", newStudent);
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 201 ).json( newStudent );
		} )
	},

	deleteStudent( req, res ) {
		Student.findByIdAndRemove( req.params.id, ( err, deletedStudent ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( deletedStudent );
		} )
	}

}
