angular.module('recruiterBot')
	.controller('homeCtrl', function($scope, homeService, $state){

		$scope.showCreateNewAccountForm = false;

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
		$scope.showCreateNewAccount = ()=>{
			$scope.showCreateNewAccountForm = true;
		}
		$scope.hideCreateNewAccount = ()=>{
			$scope.showCreateNewAccountForm = false;
		}
		
		$scope.createUser = (newAdmin)=>{
			console.log("newAdmin", newAdmin);
			if (isFormFilled(newAdmin)) {
				newAdmin.username = newAdmin.username.toLowerCase();
				newAdmin.email = newAdmin.email.toLowerCase();

				homeService.checkEmailDuplicate(newAdmin.email)
				.then((response)=>{
					console.log(response);
					if (response.data !== null) {
						alert(`${newAdmin.email} is already taken! Please enter a different email`);
						$scope.newAdmin.email = "";
					}else{
						homeService.createUser(newAdmin)
						.then((response)=>{
							homeService.adminVerified = true;
							$state.go('dashboard');
						})
					}
					
				})
			}else{
				alert("Requirements: \n 1. Username, email & password must be longer than 5 characters")
			}
		}


		// local functions
		let checkLoginRequiredFields = (admin)=>{
			if (admin.username && admin.password) {
				return true;
			}return false;
		}

		let isFormFilled = (newAdmin)=>{
			let lengthRequirement = 5;
			if(newAdmin.username && newAdmin.password && newAdmin.email) {
				if ( (newAdmin.username.length >= lengthRequirement) && 
				   (newAdmin.password.length >= lengthRequirement) && 
				   (newAdmin.email.length >= lengthRequirement)) {
					return true;
				}	
					
			}
			return false;
		}

// end of homeCtrl		
	})