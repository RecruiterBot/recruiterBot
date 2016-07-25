angular.module('recruiterBot')
	.service('dashboardService', function($http){
		
		this.addAdmin = (newAdmin)=>{
			console.log(newAdmin);
			// return $http.put(`/api/admin/email`, newAdmin);
		}

		this.createStudent = (newAdmin)=>{
			console.log(newAdmin);
			// return $http.post(`/api/students`, newAdmin);
		}
// end of dashboardService		
	})