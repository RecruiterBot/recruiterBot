angular.module('recruiterBot')
	.controller('dashboardCtrl', function($scope, homeService){
		
		$scope.showDashboard = true;
		$scope.showStudent = false;
		$scope.showAdmin = false;

		$scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
		$scope.skills = ["HTML5", "CSS3", "Javascript", "Git", "GitHub", "jQuery", "AngularJS", "Node.JS", "Express", "Module Management", "React", "Webpack", "Flux", "Browserify", "Gulp", "MongoDB", "Firebase", "Bootstrap"];

		$scope.selectedSkills = ["Bangladesh", "India", "Pakistan"];


		$scope.showDashboardView = ()=>{
			$scope.showDashboard = true;
			$scope.showStudent = false;
			$scope.showAdmin = false;
			$scope.selectedSkill = "";
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

		// $scope.whenSkillAdded = (selectedSkill)=>{
		// 	console.log(selectedSkill, selectedSkill.length);
		// 	if (!selectedSkill.length) {
		// 		$scope.showSkillAdd = false;
		// 	}
		// 	$scope.showSkillAdd = true;
		// } 

		$scope.addToSkillsBox = (selectedSkill)=>{
			
			let selectedSkillToArray = selectedSkill.split(" ");
			let skillFormatted = "" + selectedSkillToArray[0].charAt(0).toUpperCase() + selectedSkillToArray[0].slice(1);
			for (var i = 1; i < selectedSkillToArray.length; i++) {
				skillFormatted = skillFormatted + " " + selectedSkillToArray[i].charAt(0).toUpperCase() + selectedSkillToArray[i].slice(1);
			}
			if ($scope.selectedSkills.indexOf(skillFormatted) === -1) {
				$scope.selectedSkills.push(skillFormatted);
			}
			$scope.selectedSkill = "";
		}

		$scope.removeSkill = (skill)=>{
			let skillIndex = $scope.selectedSkills.indexOf(skill);
			$scope.selectedSkills.splice(skillIndex, 1);
		}












// end of dashboardCtrl		
	})












