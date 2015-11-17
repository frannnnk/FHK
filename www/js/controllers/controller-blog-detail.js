var app = angular.module('frank.controllers.blog.detail', []);

app.controller('BlogDetailController', function($scope,$stateParams) {
	console.log("BlogDetailController");
	$scope.postId = $stateParams.id;
	console.log("ID:"+$scope.postId);
});
