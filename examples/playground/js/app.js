var app = angular.module('moebio', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/playground/:name', {
			templateUrl: 'playground.html',
			controller: 'PlaygroundController'
		});
		// $locationProvider.html5Mode(true);
});
