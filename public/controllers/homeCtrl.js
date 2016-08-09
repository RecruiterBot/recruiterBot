angular.module('recruiterBot')
	.controller('homeCtrl', function($scope, homeService, $state){

		// $scope.showCreateNewAccountForm = false;

		$scope.login = ( user ) => {

			homeService.login( user )
			.then( ( response ) => {
				console.log(response);
				if ( !response ) {
					console.log( 'unable to login' )
				}
				$state.go( 'dashboard' );
			} )
		}
		// $scope.showCreateNewAccount = ()=>{
		// 	$scope.showCreateNewAccountForm = true;
		// }
		// $scope.hideCreateNewAccount = ()=>{
		// 	$scope.showCreateNewAccountForm = false;
		// }
		
		


		// local functions
		let checkLoginRequiredFields = (admin)=>{
			if (admin.username && admin.password) {
				return true;
			}return false;
		}


// end of homeCtrl		
	})