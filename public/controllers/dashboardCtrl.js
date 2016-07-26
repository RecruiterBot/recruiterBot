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
		// $scope.showEditStudentProfile = false;
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
		// $scope.editStudentProfile = ()=>{
		// 	$scope.showEditStudentProfile = true;
		// }
		// $scope.hideEditStudentProfile = ()=>{
		// 	$scope.showEditStudentProfile = false;
		// }
		let getStudents = ()=>{
			dashboardService.getStudents()
			.then((response)=>{
				console.log(response);
				let allStudents = response.data;
				allStudents = convertToReadableData(allStudents);
				console.log(allStudents);
				$scope.students = allStudents;
			})
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
			newStudent.yearsExperience = convertYearsExperienceToNumber(newStudent.yearsExperience);
			newStudent.address = convertAddressToArray(newStudent.address);


			// format newStudent object to json format
			let studentSkills = {};
			for (let i = 0; i < $scope.selectedSkills.length; i++) {
				studentSkills[$scope.selectedSkills[i]] = true;
			}
			newStudent.skills = studentSkills;

			console.log(newStudent);
			// send formatted newStudent object to dashboardService
			dashboardService.createStudent(newStudent)
			.then((response)=>{
				console.log(response);
				$scope.newStudent = "";
				$scope.selectedSkills = [];
				getStudents();
				$scope.showDashboardView();
			})

			// clear all input fields
			// $scope.newStudent = "";
			// $scope.selectedSkills = [];
			// getStudents();
			// $scope.showDashboardView();
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











		// local functions
		let convertYearsExperienceToNumber = (yearsExperience)=>{
			switch(yearsExperience){
				case "0-1 years": return 1;
				case "1-2 years": return 2;
				case "2-3 years": return 3;
				case "3-4 years": return 4;
				case "5+ years": return 5;
			}
		}

		let convertAddressToArray = (address)=>{
			let AddressToArray = [];
			if ((address.location) && (address.location.city) && (address.location.state) && (address.location.zip)) {
				AddressToArray.push(address.location);
			}
			if ((address.location1) && (address.location1.city) && (address.location1.state) && (address.location1.zip)) {
				AddressToArray.push(address.location1);
			}
			return AddressToArray;
		}

		let convertToReadableData = (allStudents)=>{
			for (let i = 0; i < allStudents.length; i++) {
				if (allStudents[i].devMountain === true) {
					allStudents[i].devMountain = "Yes";
				}else{
					allStudents[i].devMountain = "No";
				}
			
				if (allStudents[i].yearsExperience === 1) {
					allStudents[i].yearsExperience = "0-1 years";
				}else if (allStudents[i].yearsExperience === 2) {
					allStudents[i].yearsExperience = "1-2 years";
				}
				else if (allStudents[i].yearsExperience === 3) {
					allStudents[i].yearsExperience = "2-3 years";
				}
				else if (allStudents[i].yearsExperience === 4) {
					allStudents[i].yearsExperience = "3-4 years";
				}
				else if (allStudents[i].yearsExperience === 5) {
					allStudents[i].yearsExperience = "5+ years";
				}

				let skillsToString = "";
				for(let prop in allStudents[i].skills){
					skillsToString = skillsToString + prop + ", ";
				}
				allStudents[i].skills = skillsToString.substr(0, skillsToString.length-2);
			}
			return allStudents;
		}



		getStudents();


// end of dashboardCtrl		
	})












