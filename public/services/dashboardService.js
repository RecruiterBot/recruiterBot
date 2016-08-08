angular.module('recruiterBot')
	.service('dashboardService', function($http){
		
		// sends newAdmin email to server side 
		// this.updateEmail = (newAdmin)=>{
		// 	console.log(newAdmin);
		// 	return $http.put(`/api/admin/email`, newAdmin);
		// }

		// sends newStudent info to server side
		this.createStudent = (newStudent)=>{
			console.log(newStudent);
			return $http.post(`/api/students`, newStudent);
		}

		// requests for all students from the server side
		this.getStudents = ()=>{
			return $http.get(`/api/students`)
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
// end of dashboardService		
	})