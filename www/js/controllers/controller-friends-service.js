var app = angular.module('frank.controllers.friends.service', ['ionic.utils','ionic-frank-directive']);

app.controller('FriendServiceController', function($scope,FriendsService, $localstorage, $state) {
	/*
	swal({   title: "An input!",   text: "Write something interesting:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Write something" }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }      swal("Nice!", "You wrote: " + inputValue, "success"); });
	*/
	console.log("FriendServiceController Init.");
	$scope.frendService = FriendsService;

	//$localstorage.set('frendService.friendConfig', null);

	var friendConfigStr = $localstorage.get('frendService.friendConfig');
	if ( angular.isUndefined(friendConfigStr) || friendConfigStr == "" ) {
		console.log("friendConfigStr is undefined or empty, go to login page.");
		$state.go('tab.friends');
	}
	$scope.friendConfig = JSON.parse(friendConfigStr);
	console.log($scope.friendConfig);
	if ( $scope.friendConfig.email == "" ) {
		console.log("friendConfigStr is exist but email is empty, go to login page.");
		$state.go('tab.friends');
	}

	$scope.friendConfig.email;


	$scope.loadConfig = function(){
		if (!$scope.frendService.isLoading) {
			$scope.frendService.loadConfig($scope.friendConfig.email).then(function(data){
				console.log("Reloading config ...");
				console.log(data);
				$localstorage.set('frendService.friendConfig', JSON.stringify(data));
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};
	  
});

