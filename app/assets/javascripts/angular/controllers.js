
senktus_controllers.controller('MainCtrl', ['$scope','$rootScope','localStorageService','historyApi', function($scope,$rootScope,localStorageService,historyApi) {
  $scope.watched_history = historyApi.setupHistory();
}]);



senktus_controllers.controller('viewtrackerCtrl',['$scope','$element','historyApi', function($scope,$element,historyApi) {
	var activeiframe = $element.find('.episode_iframe.active');
	var playtracker = $element.find('.play_tracker');
	playtracker.width(activeiframe.width()).height(activeiframe.height());
	playtracker.on( "mouseover", function(){
		historyApi.saveView(json_page_data);
		playtracker.remove();
	});
}]);

senktus_controllers.controller('dynamicBackgroundrCtrl',['$scope','$element', function($scope,$element) {
	if (typeof json_page_data !== "undefined")  {
		if(_.has(json_page_data, "toon")){
			var url = json_page_data.toon.backdrop;
		}
		else{
			var url = json_page_data.backdrop;
		}

		if($element.find('#background_check').width() != 0){
			$element.css("background-image", 'url(' + url + ')').addClass('has_dynamic_background');
		}
	}
}]);

senktus_controllers.controller('spotlightEpisodeCtrl',['$scope','historyApi', function($scope,historyApi) {
  $scope.resclass = 'spotlight_episode_item';
  $scope.shownav = true;

  var show = historyApi.get("sh",json_page_data.id);
  var first = first_ep_data;

  if (show) {
    $scope.resdata = show.last_watched;
    $scope.spottitle = "Last Watched Episode"
  }

 	else{
 		$scope.resdata = first;
    $scope.spottitle = "First Episode"
 	}    
}]);


senktus_controllers.controller('resultItemCtrl',['$scope','$element', '$attrs','historyApi', function($scope, $element, $attrs, historyApi) {
	$scope.beenwatched = false;
  if($element.hasClass('episode_item')){
    var watched = historyApi.get("ep",$attrs.resultid)
  }

  if($element.hasClass('show_item')){
    var watched = historyApi.get("sh",$attrs.resultid)
  }
  
  if(watched){
    $scope.beenwatched = true;
    $scope.viewed_date = watched.viewed_date;
  }
}]);

senktus_controllers.controller('listFilterCtrl',['$scope','$element', '$attrs', function($scope, $element, $attrs) {
	 var el = angular.element($element);
      $scope.displayorder = "Asecending";
      $scope.displayorderclass = true;
      $scope.showwatchedtext = "Watched Shown"
      $scope.showwatched = true;
      $scope.showdescriptiontext = "Description Hidden"
      $scope.showdescription = false;

      var list = $element.find(".result_list");

      if(list.hasClass('episode_list')){
        $scope.listtype = 'ep';

        var options = {
          valueNames: [ 'result_title','episode_num'],
          plugins: [ListFuzzySearch()] 
        };
      }


      if(list.hasClass('show_list')){
        $scope.listtype = 'sh';

        var options = {
          valueNames: [ 'result_title'],
          plugins: [ListFuzzySearch()] 
        };
      }

      $scope.resultlist = new List($element.attr('id'), options);

      $scope.changeDisplayOrder = function() {
        if($scope.displayorder == "Asecending"){
          if($scope.listtype == "ep"){
            $scope.resultlist.sort('episode_num', { order: "desc" });
          }

          if($scope.listtype == "sh"){
            $scope.resultlist.sort('result_title', { order: "desc" });
          }
          
          $scope.displayorder = "Decending";
          $scope.displayorderclass = false;
        }

        else{
          if($scope.listtype == "ep"){
            $scope.resultlist.sort('episode_num', { order: "asc" });
          }

          if($scope.listtype == "sh"){
            $scope.resultlist.sort('result_title', { order: "asc" });
          }

          $scope.displayorder = "Asecending";
          $scope.displayorderclass = true;
        }
      };

      $scope.showWatched = function() {
        if($scope.showwatched){
          $scope.showwatchedtext = "Watched Hidden"
          $scope.showwatched = false;
        }

        else{
          $scope.showwatchedtext = "Watched Shown"
          $scope.showwatched = true;
        }
      };

      $scope.showDescription = function() {
        if($scope.showdescription){
          $scope.showdescriptiontext = "Descriptions Hidden"
          $scope.showdescription = false;
        }

        else{
          $scope.showdescriptiontext = "Descriptions Shown"
          $scope.showdescription = true;
        }
      };

      $scope.searchList = function(text){
        $scope.resultlist.fuzzySearch.search(text);
      }
}]);

senktus_controllers.controller('spotlightShowCtrl',['$scope','$element', '$attrs','$http', function($scope, $element, $attrs, $http) {
  $scope.pageurl = window.location.origin;
  $scope.initOnload = true;
  $scope.speed=2500;
  $scope.autoplay=true;  
  $scope.fade=true;

  $http.get($scope.pageurl + '/spotlights.json').success(function(data) {
    $scope.spotData = data.data;
    console.log($scope.spotData);
  }).
  error(function(data, status) {
    console.error("spotlight api fail");
  });

}]);


senktus_controllers.controller('watchedHistoryCtrl',['$scope','$element','historyApi', function($scope,$element,historyApi) {
  $scope.resclass = 'watched_episode_item';
  $scope.shownav = true;
  $scope.epData = $scope.watched_history.episodes;
  $scope.shData = $scope.watched_history.shows;
  $scope.activeTab = "sh"

  angular.forEach($scope.shData, function(value, key) {
    console.log(value);
  });
  

}]);
