var app = angular.module('frank.controllers.friends.service', ['ionic.utils']);

app.controller('FriendServiceController', function($scope,FriendsService, $localstorage) {
	/*
	swal({   title: "An input!",   text: "Write something interesting:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Write something" }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }      swal("Nice!", "You wrote: " + inputValue, "success"); });
	*/

	$scope.frendService = FriendsService;

	$scope.loadConfig = function(){
		if (!$scope.frendService.isLoading) {
			$scope.frendService.loadConfig().then(function(data){
				// go to state
				console.log(data);
				$localstorage.set('frendService.friendConfig', data);

			});
		}
	};


  
});
