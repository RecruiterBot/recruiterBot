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

		this.createAdmin = (admin)=>{
			admin.email = ['matt.devmtn.com']
			return $http.post('/api/admin', admin)
		}

// end of homeService		
	})