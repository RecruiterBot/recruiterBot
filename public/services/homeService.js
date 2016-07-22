angular.module('recruiterBot')
	.service('homeService', function($http){
		
		this.login = (admin)=>{
			return $http.put('/api/admin/login', admin)
		}

// end of homeService		
	})