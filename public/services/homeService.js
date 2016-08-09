angular.module('recruiterBot')
	.service('homeService', function( $http ){
		
		this. admin = {};
		
		this.login = ( user ) => {
			return $http.put('/api/admin/login', user)
			.then( ( response ) => {
				console.log(response);
				this.admin.username = response.data.username;
				this.admin.email = response.data.email;
				this.admin._id = response.data._id;
				return response.data;
			} )
		}

// end of homeService		
	})