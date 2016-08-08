angular.module('recruiterBot')
	.service('homeService', function( $http ){
		
		this.login = ( user ) => {
			return $http.put('/api/admin/login', user)
			.then( ( response ) => {
				return response.data;
			} )
		}

		this.createUser = (newAdmin) =>{
			return $http.put(`/api/admin`, newAdmin)
		}

		this.checkEmailDuplicate = (newAdminEmail)=>{
			return $http.put(`/api/admin/checkEmailDublicate`, {email: newAdminEmail})
		}

// end of homeService		
	})