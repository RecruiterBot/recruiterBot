angular.module('recruiterBot')
	.controller('dashboardCtrl', function($scope, homeService){
		
		$scope.showDashboard = true;
		$scope.showStudent = false;
		$scope.showAdmin = false;

		$scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
		$scope.skills = [];

		$scope.showDashboardView = ()=>{
			$scope.showDashboard = true;
			$scope.showStudent = false;
			$scope.showAdmin = false;
		}
		$scope.showStudentView = ()=>{
			$scope.showDashboard = false;
			$scope.showStudent = true;
			$scope.showAdmin = false;
		}
		$scope.showAdminView = ()=>{
			$scope.showDashboard = false;
			$scope.showStudent = false;
			$scope.showAdmin = true;
		}


// end of dashboardCtrl		
	})