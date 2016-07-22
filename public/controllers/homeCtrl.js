angular.module('recruiterBot')
	.controller('homeCtrl', function($scope, homeService){
		
		$scope.login = (admin)=>{
			homeService.login(admin)
			.then((response)=>{
				console.log(response);
			})
		}

// end of homeCtrl		
	})