


senktus_directives.directive('viewtracker', function() {
  return {
    restrict: 'A',
    controller:'viewtrackerCtrl'
  };//end return
});


senktus_directives.directive('dynamicBackground', function() {
  return {
    restrict: 'C',
    controller:'dynamicBackgroundrCtrl',
  };//end return
});

senktus_directives.directive('spotlightEpisode', function($templateCache,$compile,historyApi) {
  return {
    restrict: 'A',
   	scope: true,
    controller:'spotlightEpisodeCtrl',
  };//end return
});

senktus_directives.directive('resultItem', function(historyApi) {
  return {
    restrict: 'C',
    scope: true,
    controller: 'resultItemCtrl'
  };//end return
});


senktus_directives.directive('listFilter', function() {
  return {
    restrict: 'AC',
    scope: true,
    controller: 'listFilterCtrl'
  };//end return
});

senktus_directives.directive('spotlightShow', function() {
  return {
    restrict: 'ACE',
    scope: true,
    controller: 'spotlightShowCtrl'
  };//end return
});

senktus_directives.directive('watchedHistory', function() {
  return {
    restrict: 'ACE',
    controller: 'watchedHistoryCtrl'
  };//end return
});