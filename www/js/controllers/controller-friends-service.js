var app = angular.module('frank.controllers.friends.service', ['ionic.utils','ionic-frank-directive']);

app.controller('FriendServiceController', function($scope,FriendsService, $localstorage, $state) {
	/*
	swal({   title: "An input!",   text: "Write something interesting:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Write something" }, function(inputValue){   if (inputValue === false) return false;      if (inputValue === "") {     swal.showInputError("You need to write something!");     return false   }      swal("Nice!", "You wrote: " + inputValue, "success"); });
	*/
	console.log("FriendServiceController Init.");
	$scope.frendService = FriendsService;

	var friendConfigStr = $localstorage.get('frendService.friendConfig');
	if ( angular.isUndefined(friendConfigStr) || friendConfigStr == "" ) {
		$state.go('tab.friends');
	}

	$scope.friendConfig = JSON.parse(friendConfigStr);
	console.log($scope.friendConfig);
	  
});

