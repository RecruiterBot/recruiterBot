angular.module('recruiterBot')
	.controller('homeCtrl', function($scope, homeService, $state){
		

		$scope.login = ( user ) => {
				homeService.login( user )
				.then( ( response ) => {
					if ( !response ) {
						return console.log( 'unable to login' )
					}
					console.log( 'res user', response )
					$state.go( 'dashboard' );
				} )
		}

		$scope.createAdmin = (admin)=>{
			homeService.createAdmin(admin)
			.then((response)=>{
				console.log(response);
			} )
		}

// end of homeCtrl		
	})