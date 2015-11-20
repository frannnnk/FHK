var app = angular.module('frank.controllers.friends', ['ionic.utils']);

app.controller('FriendsController', function($scope,FriendsService, $localstorage, $state) {
	/*
	swal({   title: "An input!",   text: "Write something interesting:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Write something" }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }      swal("Nice!", "You wrote: " + inputValue, "success"); });
	*/

	$scope.frendService = FriendsService;

	var friendConfig = $localstorage.get('frendService.friendConfig');
	console.log(friendConfig);
	if ( !angular.isUndefined(friendConfig) && friendConfig != "" ) {
		console.log("Config exist, go to service page.");
		$state.go('tab.friendservice');
	}


	$scope.loadConfig = function(){
		if (!$scope.frendService.isLoading) {
			$scope.frendService.loadConfig().then(function(data){
				// go to state
				console.log(data);
				$localstorage.set('frendService.friendConfig', JSON.stringify(data));
				$state.go('tab.friendservice');

			});
		}
	};


  
});
