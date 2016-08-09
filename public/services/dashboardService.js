angular.module('recruiterBot')
	.service('dashboardService', function($http, $state){
		
		// sends newAdmin email to server side 
		// this.updateEmail = (newAdmin)=>{
		// 	console.log(newAdmin);
		// 	return $http.put(`/api/admin/email`, newAdmin);
		// }

		// sends newStudent info to server side
		this.createStudent = (newStudent)=>{
			return $http.post(`/api/students`, newStudent);
		}

		// requests for all students from the server side
		this.getStudents = ()=>{
			return $http.get(`/api/students`)
				.error( data => {
					$state.go( 'home' )
					return;
				} )
		}

		// sends request to delete a student from server side
		this.deleteStudent = (studentId)=>{
			return $http.delete(`/api/students/${studentId}`)
		}

		// sends updated student profile to update student info on the database
		this.updateStudentById = (updatedStudent)=>{
			return $http.put(`/api/students/${updatedStudent._id}`, updatedStudent);
		}

		// before submitting/updating student forms, checks email duplicates for new students
		this.checkStudentEmailDuplicate = (studentEmail)=>{
			console.log(studentEmail);
			return $http.put(`/api/student/checkStudentEmailDuplicate`, {email: studentEmail});
		}
		
		//logout
		this.logout = () => {
			return $http.get( `/api/logout` );
		}

		// create new admin
		this.createUser = (newAdmin) =>{
			return $http.put(`/api/admin`, newAdmin)
		}

		// checks for admin email duplicates
		this.checkEmailDuplicate = (newAdminEmail)=>{
			console.log(newAdminEmail);
			return $http.put(`/api/admin/checkEmailDuplicate`, {email: newAdminEmail})
		}

		// requests to update admin info
		this.updateAdminInfo = (updateAdmin) =>{
			console.log(updateAdmin);
			return $http.put(`/api/admin/updateAdminInfo`, {
				_id: updateAdmin._id,
				username: updateAdmin.username,
				password: updateAdmin.password,
				email: updateAdmin.email
			});
		}

// end of dashboardService		
	})