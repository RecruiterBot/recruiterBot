angular.module('recruiterBot')
	.service('dashboardService', function($http){
		
		// sends newAdmin email to server side 
		this.addAdmin = (newAdmin)=>{
			console.log(newAdmin);
			// return $http.put(`/api/admin/email`, newAdmin);
		}

		// sends newStudent info to server side
		this.createStudent = (newStudent)=>{
			console.log(newStudent);
			// return $http.post(`/api/students`, newStudent);
		}
// end of dashboardService		
	})