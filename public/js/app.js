angular.module('recruiterBot', ['ui.router'])
	.config(function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('entry',{
				url:'/',
				templateUrl:'./views/entry.html'
			})
			.state('how_works',{
				url:'/how_works',
				templateUrl:'./views/howItWorks.html'
			})
			.state('home', {
				url:'/home',
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
