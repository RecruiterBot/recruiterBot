angular.module('recruiterBot')
	.service('homeService', function( $http ){
		
		this.login = ( user ) => {
			console.log( user );
			return $http.put('/api/admin/login', user)
			.then( ( response ) => {
				console.log( 'response', response);
				return response.data;
			} )
		}

		this.createUser = (newAdmin) =>{
			console.log(newAdmin);
			return $http.put(`/api/admin`, newAdmin)
		}

		this.checkEmailDuplicate = (newAdminEmail)=>{
			console.log(newAdminEmail);
			return $http.put(`/api/admin/checkEmailDuplicate`, {email: newAdminEmail})
		}

// end of homeService		
	})