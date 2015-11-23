// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('frank', ['ionic', 
                         'ngCordova',                        
                         'frank.controllers.photo', 
                         'frank.controllers.about',
                         'frank.controllers.blog',
                         'frank.controllers.blog.detail',
                         'frank.controllers.friends',
                         'frank.controllers.podcast',
                         'frank.service.photo',
                         'frank.service.blog',
                         'frank.service.blog.detail',
                         'frank.service.podcast',
                         'frank.service.englishpod',
                         'frank.service.friend',
                         'frank.controllers.friends.service',
                         'ionic.utils',
                         'ngIOS9UIWebViewPatch'
                         ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive('fadeIn', function($timeout){
    return {
        restrict: 'A',
        link: function($scope, $element, attrs){
            $element.addClass("ng-hide-remove");
            $element.on('load', function() {
                $element.addClass("ng-hide-add");
            });
        }
    }
})


/*
.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
              $rootScope.hideTabs = '';
          });
      }
  };
})
*/

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.about', {
    url: '/about',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-about.html',
        controller: 'AboutController'
      }
    }
  })
    

  .state('tab.photo', {
    url: '/photo',
    views: {
      'tab-photo': {
        templateUrl: 'templates/tab-photo.html',
        controller: 'PhotoController'
      }
    }
  })

  .state('tab.podcast', {
    url: '/podcast',
    views: {
      'tab-podcast': {
        templateUrl: 'templates/tab-podcast-player.html',
        controller: 'PodcastController'
      }
    }
  })

  .state('tab.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsController'
      }
    }
  })

  .state('tab.blog', {
      url: '/blog',
      views: {
        'tab-blog': {
          templateUrl: 'templates/tab-blog.html',
          controller: 'BlogController'
        }
      }
    })
  

  .state('tab.post', {
      url: "/post/:id",
      views: {
        'tab-blog': {
          templateUrl: "templates/tab-blog-detail.html",
          controller: 'BlogDetailController'
        }
      }      
    })

  .state('tab.friendservice', {
      url: "/fs",
      views: {
        'tab-friends': {
          templateUrl: "templates/tab-friend-service.html",
          controller: 'FriendServiceController'
        }
      }      
    })

  .state('tab.ep', {
      url: "/fs/ep",
      views: {
        'tab-friends': {
          templateUrl: "templates/tab-friend-service-ep.html",
          controller: 'EnglishPodController'
        }
      }      
    });

 


  
  /*

   .state('tab.blogpost', {
      url: "/blogpost/:id",
      templateUrl: "templates/tab-blog-detail.html",
      controller: 'BlogDetailController'
  });

  .state('tab.blog-detail', {
      url: '/blog-detail/:blogId',
      templateUrl: 'templates/tab-blog-detail.html',
      controller: 'BlogDetailController'
  });
  
 
  */
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/about');

});
