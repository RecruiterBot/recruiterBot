angular.module('recruiterBot')
	.controller('homeCtrl', function($scope, homeService, $state){
		

		$scope.login = (admin)=>{
			if (checkLoginRequiredFields(admin)) {
				homeService.login(admin)
				.then((response)=>{
					$scope.adminInfo = response.data;
					if ($scope.adminInfo.error) {
						alert($scope.adminInfo.error)
					}else{
						homeService.adminVerified = true;
						$state.go('dashboard');
					}
				})
			}else{
				alert ("Please fill in username & password")
			}
		}

		$scope.createAdmin = (admin)=>{
			homeService.createAdmin(admin)
			.then((response)=>{
				console.log(response);
			})
		}


		// local function
		let checkLoginRequiredFields = (admin)=>{
			if (admin.username && admin.password) {
				return true;
			}return false;
		}

// end of homeCtrl		
	})