angular.module('recruiterBot')
	.controller('dashboardCtrl', function($scope, dashboardService, homeService, $state){
		
		// //////////////////////////////// recruiterBot global variables //////////////////////////////////////////
		$scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
		$scope.skills = [ 'html5','css3','javascript','git','github','jquery','angular','node','express','module management','react','webpack','flux','browserify','gulp','mongo','firebase','bootstrap' ];
		$scope.selectedSkills = [];
		$scope.selectedLocations = [];

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
		$scope.students;

		let verifyAuth = ()=>{
			console.log(homeService.adminVerified);
			if (homeService.adminVerified === true) {
				getStudents();
			}else{
				$state.go('home');
			}
		}

		$scope.logout = ()=>{
			homeService.adminVerified === false;
			$state.go('home');
		}

		let getStudents = ()=>{
			dashboardService.getStudents()
			.then((response)=>{
				// console.log(response);
				let data = response.data;
				console.log(data);
				let allStudents = response.data;
				allStudents = convertToReadableData(allStudents);
				console.log(allStudents);
				$scope.students = allStudents;
			})
		}

		$scope.updateStudentById = (updatedStudent)=>{
			updatedStudent.yearsExperience = convertYearsExperienceToNumber(updatedStudent.yearsExperience);
			if (updatedStudent['devMountain'] === "Yes") {
				updatedStudent['devMountain'] = true;
			}else{
				updatedStudent['devMountain'] = false;
			}
			
			console.log("Before", updatedStudent.locations);

			for (let i = 0; i < updatedStudent.locations.length; i++) {
				updatedStudent.locations[i].city = updatedStudent.locations[i].city.toLowerCase();
				updatedStudent.locations[i].state = updatedStudent.locations[i].state.toLowerCase();
			}	

			console.log("After", updatedStudent.locations);

			dashboardService.updateStudentById(updatedStudent)
			.then((response)=>{
				getStudents();
			})
		}

		$scope.deleteStudent = (studentId)=>{
			dashboardService.deleteStudent(studentId)
			.then((response)=>{
				getStudents();
			})
		}

		$scope.removeUpdatedSkill = (studentId, skill)=>{
			for (var i = 0; i < $scope.students.length; i++) {
				if ($scope.students[i]._id === studentId) {
					console.log($scope.students[i].skills);
					delete $scope.students[i].skills[skill];
					console.log($scope.students[i].skills);
				}
			}
		}

		$scope.addToUpdatedSkillsBox = (studentId, selectedSkill)=>{
			for (var i = 0; i < $scope.students.length; i++) {
				if ($scope.students[i]._id === studentId){
					$scope.students[i].skills[selectedSkill] = selectedSkill;
				}
			}
		}

		$scope.removeUpdatedLocation = (studentId, locationId)=>{
			for (var i = 0; i < $scope.students.length; i++) {
				if ($scope.students[i]._id === studentId) {
					for (var j = 0; j < $scope.students[i].locations.length; j++) {
						if ($scope.students[i].locations[j]._id === locationId) {
							$scope.students[i].locations.splice(j, 1);
						}
					}
				}
			}
		}

		$scope.addUpdatedLocationToLocationBox = (studentId, updatedCity, updatedState)=>{
			for (var i = 0; i < $scope.students.length; i++) {
				if ($scope.students[i]._id === studentId) {
					let isAlreadyInLocationBox = false;
					for (var j = 0; j < $scope.students[i].locations.length; j++) {
						if ($scope.students[i].locations[j].city === updatedCity && 
							$scope.students[i].locations[j].state === updatedState) {

							isAlreadyInLocationBox = true;
						}	
					}
					if (isAlreadyInLocationBox === false) {
							$scope.students[i].locations.push(
							{
								city: updatedCity,
								state: updatedState
							}
						)
					}
					
				}
			}
		}


		// //////////////////////////////// student-jumbotron /////////////////////////////////////////////////////

		// adds a specific skill in the New Student Form
		$scope.addToSkillsBox = (selectedSkill)=>{
			let selectedSkillToArray = selectedSkill.split(" ");
			let skillFormatted = "" + selectedSkillToArray[0].charAt(0).toUpperCase() + selectedSkillToArray[0].slice(1);
			for (let i = 1; i < selectedSkillToArray.length; i++) {
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



		// adds a specific location in the New Student Form
		$scope.addLocationToLocationBox = (selectedCity, selectedState)=>{
			let location = {
				city: selectedCity,
				state: selectedState
			}
			let isNewLocation = true;
			for (let i = 0; i < $scope.selectedLocations.length; i++) {
				if ($scope.selectedLocations[i].city === selectedCity) {
					isNewLocation = false;
				}
			}
			if (isNewLocation === true) {
				$scope.selectedLocations.push(location);
			}
		}	

		$scope.removeLocation = ( location ) => {
			let locationIndex = $scope.selectedLocations.indexOf( location.city );
			$scope.selectedLocations.splice( locationIndex, 1 );
		}




		// creates a new student by using New Student Form
		$scope.createStudent = ( newStudent ) => {

			let alertMessage = "Please enter the following:\n";
			let alertMessageDetails = alertMessage;
			let counter = 1;

			if (!newStudent) {
				return alert("Please fill out the form");
			}
			if (!newStudent.name || !newStudent.name.firstName) {
				alertMessageDetails = alertMessageDetails + counter + ". First Name (i.e., 'Jackie')\n";
				counter++;
			}
			
			if (!newStudent.name || !newStudent.name.lastName) {
				alertMessageDetails = alertMessageDetails + counter + ". Last Name (i.e., 'Robinson')\n";
				counter++;
			}
			
			if (!newStudent.email || (newStudent.email.split('').indexOf('@') === -1)) {
				alertMessageDetails = alertMessageDetails + counter + ". Email (i.e., 'jrobinson@gmail.com')\n";
				counter++;
			}
			
			if ($scope.selectedLocations.length === 0) {
				alertMessageDetails = alertMessageDetails + counter + ". Location (at least 1 location)\n";
				counter++;
			}
			
			if (!newStudent.devMountain) {
				alertMessageDetails = alertMessageDetails + counter + ". DevMountain Student (Yes/No)\n";
				counter++;
			}
			
			// if (!newStudent.campus ) {
			// 	alertMessageDetails = alertMessageDetails + counter + ". DevMountain Campus\n";
			// 	counter++;
			// }
			if (!newStudent.yearsExperience ) {
				alertMessageDetails = alertMessageDetails + counter + ". Years of Experience\n";
				counter++;
			}
			
			if (counter > 1) {
				return alert(alertMessageDetails);
			}
			
			// string formatters
			newStudent.name.firstName = stringTrimmer(newStudent.name.firstName);
			newStudent.name.lastName = stringTrimmer(newStudent.name.lastName);
			newStudent.name.firstName = capitalizeFirstLetterOfWords(newStudent.name.firstName);
			newStudent.name.lastName = capitalizeFirstLetterOfWords(newStudent.name.lastName);
			newStudent.email = newStudent.email.trim();


			// change 'devMountain' property to boolean
			if (newStudent['devMountain'] === "Yes") {
				newStudent['devMountain'] = true;
			}else{
				newStudent['devMountain'] = false;
			}
			newStudent.yearsExperience = convertYearsExperienceToNumber(newStudent.yearsExperience);


			// format newStudent object to json format
			let studentSkills = {};
			for ( let i = 0; i < $scope.selectedSkills.length; i++ ) {
				let currentSkill = $scope.selectedSkills[i].toLowerCase();
				studentSkills[ currentSkill ] = currentSkill;
			}
			newStudent.skills = studentSkills;
			newStudent.locations = $scope.selectedLocations;


			for ( let i = 0; i < newStudent.locations.length; i++ ) {
				newStudent.locations[i].city = newStudent.locations[i].city.toLowerCase();
				newStudent.locations[i].state = newStudent.locations[i].state.toLowerCase();
			}


			console.log( "new student", newStudent );
			// send formatted newStudent object to dashboardService
			dashboardService.createStudent( newStudent )
			.then( ( response ) => {
				console.log( "response", response );
				$scope.newStudent = "";
				$scope.selectedSkills = [];
				getStudents();
				$scope.showDashboardView();
			})

		}

		// ///////////////////////////////////// admin-jumbotron /////////////////////////////////////////////////

		// updates email for a new admin
		$scope.updateEmail = (newAdmin)=>{

			if (confirm(`Authorize '${newAdmin.email}' as admin?`) == true) {
		         dashboardService.updateEmail(newAdmin)
				.then((response)=>{
					console.log(response);
					$scope.newAdmin = "";
				})
		    }
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
				allStudents[i].locations = locationsCapitalizer(allStudents[i].locations);
				// allStudents[i].skills = skillsCapitalizer(allStudents[i].skills);
			}

			return allStudents;
		}

		let capitalizeFirstLetterOfWords = (str)=>{
			let strToArray = str.split(" ");
			let toReturn = "";
			for (let i = 0; i < strToArray.length; i++) {
				toReturn = toReturn + (strToArray[i].charAt(0).toUpperCase() + strToArray[i].slice(1)) + " ";
			}
			return toReturn.substr(0, toReturn.length-1);
		}
		let stringTrimmer = (str)=>{
			str = str.replace(/\s+/g, " ");
			return str;
		}

		let locationsCapitalizer = (locations)=>{
			for(let l=0; l<locations.length; l++){
				let city = locations[l].city.split(" ");
				let cityCapitalized = "";
				for(let c=0; c<city.length; c++){
					cityCapitalized = cityCapitalized + city[c].charAt(0).toUpperCase() + city[c].slice(1);
					if(c !== city.length-1){
						cityCapitalized = cityCapitalized + " ";
					}
				}
				locations[l].city = cityCapitalized;
				
				let state = locations[l].state.split(" ");
				let stateCapitalized = "";
				for(let s=0; s<state.length; s++){
					stateCapitalized = stateCapitalized + state[s].charAt(0).toUpperCase() + state[s].slice(1);
					if(s !== state.length-1){
						stateCapitalized = stateCapitalized + " ";
					}
				}
				locations[l].state = stateCapitalized;
			
			}
			return locations;
		}

		// let skillsCapitalizer = (skills)=>{
		// 	for(let prop in skills){
		// 		console.log(skills[prop]);
		// 		let currSkill = skills[prop].split(' '); // ["module", "management"]
		// 		let skillsCapitalized = "";
		// 		for(let i = 0; i<currSkill.length; i++){
		// 			skillsCapitalized = skillsCapitalized + currSkill[i].charAt(0).toUpperCase() + currSkill[i].slice(1);
		// 			if(i !== currSkill.length-1){
		// 				skillsCapitalized = skillsCapitalized + " ";
		// 			}
		// 		}
		// 		skills[prop] = skillsCapitalized;
		// 	}
		// 	return skills;
		// }



		verifyAuth();


// end of dashboardCtrl		
	})












