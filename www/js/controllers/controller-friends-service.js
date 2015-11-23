var app = angular.module('frank.controllers.friends.service', ['ionic.utils','ionic-frank-directive','ionic-audio-mod']);

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

app.controller('EnglishPodController', function($scope,$ionicLoading,FriendsService,EnglishPodService, $localstorage, $state) {

	console.log("FriendServiceController Init.");
	$scope.frendService = FriendsService;
	$scope.englishPodService = EnglishPodService;

	/* Check local storage and get user email */
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


	/* Show loading  */
	$ionicLoading.show({template:'Loading...'});

	/* Load data */
	$scope.englishPodService.load($scope.friendConfig.email).then(function(){
		$ionicLoading.hide();
	});

	$scope.$on('$ionicView.enter', function() {
	    //analytics.trackView('Screen Title');
	    console.log("englishpod detail list enter");
	    //$(".tab-nav.tabs").slideDown("fast");
	});
	$scope.$on('$ionicView.leave', function() {
	    //analytics.trackView('Screen Title');
	    console.log("englishpod detail list leave");
	});

	$scope.doRefresh = function(){
		if (!$scope.englishPodService.isLoading) {
			$scope.englishPodService.refresh().then(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
		}
	};
	$scope.loadMore = function(){
		console.log("Load More");
		if (!$scope.englishPodService.isLoading && $scope.englishPodService.hasMore) {
			$scope.englishPodService.next().then(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
	};
	$scope.download = function(track){
		console.log("Downloading "+track.title+" "+track.url);
		
		$scope.englishPodService.download(track).then(function(result){
			console.log(track.title + " ("+track.uniqueName+")" + " download completed.");
			console.log(JSON.stringify(result));
			console.log(result.fullPath);
			console.log(result.nativeURL);

			
		});
		
	};
	$scope.checkFile = function(track){
		
		$scope.englishPodService.checkFile(track);
		
	};

	


	//-controller
	  
});

