angular.module('recruiterBot', ['ui.router'])
	.config(function ($stateProvider, $urlRouterProvider) {
		
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('home', {
				url:'/',
				templateUrl: './views/home.html',
				controller: 'homeCtrl'
			})
			.state('dashboard', {
				url:'/dashboard',
				templateUrl: './views/dashboard.html',
				controller: 'dashboardCtrl'
			})
			


// end of config		
	})