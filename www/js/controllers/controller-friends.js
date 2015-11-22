var app = angular.module('frank.controllers.friends', ['ionic.utils']);

app.controller('FriendsController', function($scope,FriendsService, $localstorage, $state) {
	/*
	swal({   title: "An input!",   text: "Write something interesting:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Write something" }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }      swal("Nice!", "You wrote: " + inputValue, "success"); });
	*/

	$scope.frendService = FriendsService;
	var friendConfig = $localstorage.get('frendService.friendConfig');
	console.log(friendConfig);
	

	$scope.$on('$ionicView.beforeEnter', function() {
	    if ( !angular.isUndefined(friendConfig) && friendConfig != "" ) {
			var friendConfigObj = JSON.parse(friendConfig);
			if (!angular.isUndefined(friendConfigObj)) {
				if (  !angular.isUndefined(friendConfigObj.email ) && friendConfigObj.email != "" ) {
					console.log("Config exist ("+friendConfigObj.email+"), go to service page.");
					$state.go('tab.friendservice');
				}
			}			
		}
	});
	


	$scope.loadConfig = function(loginEmail){
		if (!$scope.frendService.isLoading) {
			$scope.frendService.loadConfig(loginEmail).then(function(data){
				// go to state
				console.log(data);
				$localstorage.set('frendService.friendConfig', JSON.stringify(data));
				$state.go('tab.friendservice');

			});
		}
	};


  
});
