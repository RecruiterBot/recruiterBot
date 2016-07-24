angular.module('recruiterBot')
	.service('dashboardService', function($http){
		
		this.addAdmin = (newAdmin)=>{
			console.log(newAdmin);
			// return $http.put(`/api/admin/email`, newAdmin);
		}

// end of dashboardService		
	})