angular.module('recruiterBot')
	.service('homeService', function($http){
		
		this.adminVerified = false;

		
		this.login = (admin)=>{
			console.log(admin);
			return $http.put('/api/admin/login', admin)
		}

		this.createUser = (newAdmin) =>{
			console.log(newAdmin);
			return $http.put(`/api/admin`, newAdmin)
		}

		this.checkEmailDuplicate = (newAdminEmail)=>{
			console.log(newAdminEmail);
			return $http.put(`/api/admin/checkEmailDublicate`, {email: newAdminEmail})
		}

// end of homeService		
	})