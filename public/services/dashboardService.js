angular.module('recruiterBot')
	.service('dashboardService', function($http){
		
		// sends newAdmin email to server side 
		this.updateEmail = (newAdmin)=>{
			console.log(newAdmin);
			return $http.put(`/api/admin/email`, newAdmin);
		}

		// sends newStudent info to server side
		this.createStudent = (newStudent)=>{
			console.log(newStudent);
			return $http.post(`/api/students`, newStudent);
		}

		this.getStudents = ()=>{
			return $http.get(`/api/students`)
		}

		this.deleteStudent = (studentId)=>{
			return $http.delete(`/api/students/${studentId}`)
		}

		this.updateStudentById = (updatedStudent)=>{
			return $http.put(`/api/students/${updatedStudent._id}`, updatedStudent);
		}
// end of dashboardService		
	})