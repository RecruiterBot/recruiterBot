angular.module('recruiterBot')
	.controller('dashboardCtrl', function($scope, dashboardService, $state){
		
		// //////////////////////////////// recruiterBot global variables //////////////////////////////////////////
		$scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
		$scope.skills = ["HTML5", "CSS3", "Javascript", "Git", "GitHub", "JQuery", "AngularJS", "Node.JS", "Express", "Module Management", "React", "Webpack", "Flux", "Browserify", "Gulp", "MongoDB", "Firebase", "Bootstrap"];
		$scope.selectedSkills = [];

		// //////////////////////////////// initial setup //////////////////////////////////////////////////////////
		$scope.showDashboard = true;
		$scope.showStudent = false;
		$scope.showAdmin = false;
		$scope.showEditStudentProfile = false;
		$scope.showFilter = false;

		// //////////////////////////////// header-tabs ////////////////////////////////////////////////////////////
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
		$scope.filterSort = ()=>{
			$scope.showFilter = true;
		}
		$scope.hideFilter = ()=>{
			$scope.showFilter = false;
		}

		// //////////////////////////////// dashboard-jumbotron ///////////////////////////////////////////////////
		$scope.editStudentProfile = ()=>{
			$scope.showEditStudentProfile = true;
		}
		$scope.hideEditStudentProfile = ()=>{
			$scope.showEditStudentProfile = false;
		}


		// //////////////////////////////// student-jumbotron /////////////////////////////////////////////////////

		// adds a specific skill in the New Student Form
		$scope.addToSkillsBox = (selectedSkill)=>{
			let selectedSkillToArray = selectedSkill.split(" ");
			let skillFormatted = "" + selectedSkillToArray[0].charAt(0).toUpperCase() + selectedSkillToArray[0].slice(1);
			for (var i = 1; i < selectedSkillToArray.length; i++) {
				skillFormatted = skillFormatted + " " + selectedSkillToArray[i].charAt(0).toUpperCase() + selectedSkillToArray[i].slice(1);
			}
			if ($scope.selectedSkills.indexOf(skillFormatted) === -1) {
				$scope.selectedSkills.push(skillFormatted);
			}
			// $scope.selectedSkill = "";
		}

		// removes a specific skill added in the New Student Form
		$scope.removeSkill = (skill)=>{
			let skillIndex = $scope.selectedSkills.indexOf(skill);
			$scope.selectedSkills.splice(skillIndex, 1);
		}

		// creates a new student by using New Student Form
		$scope.createStudent = (newStudent)=>{

			// change 'devMountain' property to boolean
			if (newStudent['devMountain'] === "Yes") {
				newStudent['devMountain'] = true;
			}else{
				newStudent['devMountain'] = false;
			}

			// format newStudent object to json format
			let studentSkills = {};
			for (let i = 0; i < $scope.selectedSkills.length; i++) {
				studentSkills[$scope.selectedSkills[i]] = true;
			}
			newStudent.skills = studentSkills;

			// send formatted newStudent object to dashboardService
			dashboardService.createStudent(newStudent)
			// .then((response)=>{
			// 	console.log(response);
			// })

			// clear all input fields
			$scope.newStudent = "";
			$scope.selectedSkills = [];
		}

		// ///////////////////////////////////// admin-jumbotron /////////////////////////////////////////////////

		// updates email for a new admin
		$scope.updateEmail = (newAdmin)=>{
			console.log(newAdmin);
			dashboardService.updateEmail(newAdmin)
			// .then((response)=>{
			// 	console.log(response);
			// })
		}










// end of dashboardCtrl		
	})












