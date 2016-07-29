angular.module('recruiterBot')
	.service('homeService', function($http){
		
		this.adminVerified = false;

		this.login = (admin)=>{
			console.log(admin);
			return $http.put('/api/admin/login', admin)
			// .then((response)=>{
			// 	console.log(response);
			// 	if (response) {
			// 		console.log(response);
			// 		return response.data;
			// 	}else{
			// 		return { err : 'Incorrect username or password'}
			// 	}
			// })
		}

		this.createAdmin = (admin)=>{
			admin.email = ['matt.devmtn.com']
			return $http.post('/api/admin', admin)
		}

// end of homeService		
	})