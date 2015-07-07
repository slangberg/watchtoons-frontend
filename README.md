#<a name="top""></a>Watchtoons.tv Front End Files: 
<hr>
This repo contains all the HTML, SASS , JavaScript, CoffeeScript, and Ruby files that make up the front end for the proof of concept site [Watchtoons.tv](http://www.watchtoons.tv/). The full stack for the website is Postgres, Rails, Slim HTML

<hr>
##Overview
This site is an in-progress proof of concept hybrid site/web app that was intended to demonstrate a number of different experimental ui design and data management methodologies. 

##The Experimental Features of the site are:
- **Automatic public data retrieval: **As the site’s back processes new episode and show data it will automatically try to retrieve data and visual assets from public APIs and integrate those into the sites Postgres database
- **Client-Side Only User Tracking :** The site uses AngularJs to save  a users view history to local storage, this allows for the site to offer users a custom tailored ui experience without having to store visitor personal info and allows for a very lean back end
- **Seamless Dynamic User Interface:** The site uses AngularJs to deliver dynamic UI elements that can change seamlessly based on available assets and data, user view history and page based controls. This allows for a stable and tailored user experience for all users. 
- **A Dark Base and Focus on Large Visual Assets:** The least successful experiment was to test the user experience of using a black base and white accents to drive focus to the large amount of images accessible via the external APIs. 


##Watchtoons HTML
Watchtoons.tv is an Ruby on rails application, this means  all the sites HTML is written in [Slim](http://slim-lang.com/)  witch is  a fast, lightweight template engine for ruby. Slim is a tag-less indention based html preprocessor, the language will default any DOM element to a div if no type is provided. Slim will create an element with classes of any string put after a . and an id of anything put after a # sign. For more information on Slim the official doc can be found [here](http://www.rubydoc.info/gems/slim/frames#What_is_Slim_). All of the sites html templates are split up into smaller partials that can be found in the [App/Views directory](https://github.com/slangberg/watchtoons-frontend/tree/master/app/views)

##Watchtoons CSS
All of Watchtoons.tv's css is written in SASS, mores specially SCSS variant and is compiled by the Rails app. The sites SASS is split up into smaller partials that can be found in the [App/assets/stylesheets directory](https://github.com/slangberg/watchtoons-frontend/tree/master/app/assets/stylesheets)


#Watchtoons Angular App
The majority of DOM manipulation and all history tracking on watchtoons.tv is done with AngularJS, the rest is done with jQuery in the form plugins. The app is made up Greg Pike’s [ Angular Local-storage Module]( http://gregpike.net/demos/angular-local-storage/demo.html) , Vasyl Stanislavchuk's [Angular Slick directive](https://github.com/vasyabigi/angular-slick), Jonny Strömberg's [List.js](http://listjs.com), a History API factory and a collection of custom directives


##Angular factories

**History Api**: This factory provides method to get and set data stored via the local storage module using the show and episode ids as keys, these key are provided by the [view tracker directive](#viewtracker)


| Call 			| Arguments | Action | Returns |
| :------------ | ------------- | :------------ |------------ |
| setupHistory | N/A  | Checks if there is a view history object in local storage, if so sets that as the active history, if there is not one in storage it will create it and save it to local storage |N/A|
| saveView | Episode Object  | Adds passed in episode and show to the active view history object and saves it to local storage|N/A|
| get | type key, id  | Will retrieve a single episode or show object from the view history object | Show or Episode Object |
| getAll | N/A  | Will return entire view history object | View History Object |

**Code:  - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/factories.js)**

``` 
watchtoons_factories.factory('historyApi',['localStorageService','$rootScope', function(localStorageService,$rootScope){
	var watched_history_obj = {
		shows:{},
		episodes:{}
	}

	function setHistory(){
		console.warn("saved page");
		console.warn(watched_history_obj);
		localStorageService.set("watched_history", watched_history_obj);
		$rootScope.watched_history = watched_history_obj;
	}

	return{
		setupHistory:function(){
			var historycheck = localStorageService.get("watched_history");
			if(historycheck){
				historycheck.visted = true;
				watched_history_obj = historycheck;
				return historycheck;
			}
			else{
				setHistory();
			}
		},
		saveView:function(json_page_data){
			var d = new Date();
	  	json_page_data['viewed_date'] = d.toDateString();
	  	var toon = json_page_data.toon;
	  	var episode = _.omit(json_page_data, 'toon'); 
	  	

	  	if(!_.has(watched_history_obj.shows, json_page_data.toon_id)){
	  		toon['watched_episodes'] = {};
	  		toon['watched_episodes'][json_page_data.id] = episode;
	  		toon['last_watched'] = episode;
	  		toon['viewed_date'] = d.toDateString();
	  		watched_history_obj.shows[json_page_data.toon_id] = toon;
	  	}

	  	else {
	  		var saved_toon = watched_history_obj.shows[json_page_data.toon_id];
	  		saved_toon['last_watched'] = episode;
	  		saved_toon['viewed_date'] = d.toDateString();
	  		saved_toon['watched_episodes'][json_page_data.id] = episode;
	  	} 

	  	watched_history_obj.episodes[json_page_data.id] = episode;
  		
  		setHistory();
		},
		get:function(type,id){
			if(type == "sh"){
				if (!_.isUndefined(watched_history_obj.shows[id])) {
          return watched_history_obj.shows[id];
        }
        else {
        	return false;
        }
			}

			if(type == "ep"){
				if (!_.isUndefined(watched_history_obj.episodes[id])) {
          return watched_history_obj.episodes[id];
        }
        else {
        	return false;
        }
			}
		},
		getAll:function(){

        return watched_history_obj;
		}
	};
}]);
```

##Angular Directives
**<a name="directiveindex"></a>Directive Index:**

- [View Tracker Directive](#viewtracker)
- [Dynamic Background Directive](#dynamicBackground)
- [Result Item Directive](#resultItem)
- [List Filter Directive](#listFilter)
- [Home Page Spotlight Show Directive](#spotlightShow)
- [Watched History List Directive](#watchedHistory)


###<a name="viewtracker"></a> View Tracker Directive 
This directive will save a view using the History Api when a user hovers over a video, it user hover so the site can use iframe based externally hosted videos

**Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L4)**

``` 
watchtoons_directives.directive('viewtracker', function() {
  return {
    restrict: 'A',
    controller:'viewtrackerCtrl'
  };
});
```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L8)
**

``` 
watchtoons_controllers.controller('viewtrackerCtrl',['$scope','$element','historyApi', function($scope,$element,historyApi) {
	var activeiframe = $element.find('.episode_iframe.active');
	var playtracker = $element.find('.play_tracker');
	playtracker.width(activeiframe.width()).height(activeiframe.height());
	playtracker.on( "mouseover", function(){
		historyApi.saveView(json_page_data);
		playtracker.remove();
	});
}]);
```
[^ Go Back To Index](#directiveindex)

###<a name="dynamicBackground"></a> Dynamic Background Directive

This directive will check to see if there is a live background image for the current page. Because the site relies on externally hosted image assets that can disappear it will test to see if a hidden test image has any dimension before paling the image as a CSS background

**Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L12)**

``` 
watchtoons_directives.directive('dynamicBackground', function() {
  return {
    restrict: 'C',
    controller:'dynamicBackgroundrCtrl',
  };
});
```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L18)**

``` 
watchtoons_controllers.controller('dynamicBackgroundrCtrl',['$scope','$element', function($scope,$element) {
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
```
[^ Go Back To Index](#directiveindex)
###<a name="spotlightEpisode"></a> Spotlight Episode Directive

This directive will check if the user has viewed any episodes of current show and if they have it show will show the last episode watched along with links to the pervious and and next episodes and if not it will show the show's first episode 

** Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L19) **

``` 
watchtoons_directives.directive('spotlightEpisode', function($templateCache,$compile,historyApi) {
  return {
    restrict: 'A',
   	scope: true,
    controller:'spotlightEpisodeCtrl',
  };
});
```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L33)**

``` 
watchtoons_controllers.controller('spotlightEpisodeCtrl',['$scope','historyApi', function($scope,historyApi) {
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

```

**Template: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/views/angulartemps/_temps.slim#L1)**

``` 
	a.episode_link ng-href="/episodes/{{resdata.id}}"
	    .result_paddingbox
	      span.result_image
	        .result_thumb.episode_thumb.episode_img
	          span.episode_number {{resdata.number}}
	          img.episode_thumb_img.thumb_img ng-if="resdata.tvdb_meta.thumbnail" ng-src="{{resdata.tvdb_meta.thumbnail}}"
	          img.episode_thumb_img.thumb_img ng-if="!resdata.tvdb_meta.thumbnail" src="/assets/missing-episode.png"
	      span.result_content
	        span.result_info
	          span.result_title {{resdata.name}}
	          span.result_info_line.episode_placment.episode_num   Episode {{resdata.number}}
	        span.last_watched.result_info_line 
	        span.result_desciption.episode_desciption
	          span.text ng-if="resdata.tvdb_meta.summary" {{resdata.tvdb_meta.summary}}
	          span.text ng-if="!resdata.tvdb_meta.summary" No Episode Description Availble At This Time
	        span.watch_now_btn
	          span.play_icon
	          span.play_text Watch Now
	          span.played_text Watch Again
	      .clr
	.episode_nav ng-if="shownav"
		a.prev_button.ep_button ng-if="resdata.previous" ng-href="/episodes/{{resdata.previous.id}}" Prev Episode
		a.next_button.ep_button ng-if="resdata.next" ng-href="/episodes/{{resdata.next.id}}" Next Episode
```
[^ Go Back To Index](#directiveindex)

###<a name="resultItem"></a> Result Item Directive

This directive will check its own classes to see if its an episode item or show item and then use that data along with a id attribute to check if that item has been watched by the user and then add that state to its scope

**Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L27)**

``` 
watchtoons_directives.directive('resultItem', function(historyApi) {
  return {
    restrict: 'C',
    scope: true,
    controller: 'resultItemCtrl'
  };
});

```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L52)**

``` 
watchtoons_controllers.controller('resultItemCtrl',['$scope','$element', '$attrs','historyApi', function($scope, $element, $attrs, historyApi) {
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
}]);

```

**Standard HTML for Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/views/angulartemps/_temps.slim)**

``` 
// Episode Item Template
a.episode_link ng-href="/episodes/{{resdata.id}}"
  .result_paddingbox
    span.result_image
      .result_thumb.episode_thumb.episode_img
        span.episode_number {{resdata.number}}
        img.episode_thumb_img.thumb_img ng-if="resdata.tvdb_meta.thumbnail" ng-src="{{resdata.tvdb_meta.thumbnail}}"
        img.episode_thumb_img.thumb_img ng-if="!resdata.tvdb_meta.thumbnail" src="/assets/missing-episode.png"
    span.result_content
      span.result_info
        span.result_title {{resdata.name}}
        span.result_info_line.episode_placment.episode_num   Episode {{resdata.number}}
      span.last_watched.result_info_line 
      span.result_desciption.episode_desciption
        span.text ng-if="resdata.tvdb_meta.summary" {{resdata.tvdb_meta.summary}}
        span.text ng-if="!resdata.tvdb_meta.summary" No Episode Description Availble At This Time
      span.watch_now_btn
        span.play_icon
        span.play_text Watch Now
        span.played_text Watch Again
    .clr
.episode_nav ng-if="shownav"
  a.prev_button.ep_button ng-if="resdata.previous" ng-href="/episodes/{{resdata.previous.id}}" Prev Episode
  a.next_button.ep_button ng-if="resdata.next" ng-href="/episodes/{{resdata.next.id}}" Next Episode
		
		
// Show Item Template
a.show_link ng-href="/toons/{{resdata.id}}"
  .result_paddingbox
    span.result_image
      .result_thumb.show_thumb
        img.show_thumb_img.thumb_img.poster_img width="145" src="{{resdata.poster}}"
    span.result_content
      span.result_info
        span.result_title {{resdata.name}}
        span.rating_box
          span.rating ng-class="{{resdata.rating_class}}"
          span.rating_score {{(resdata.text_rating)}}
          span.rating_amount
            |- {{resdata.ann_rating.number}} votes
        span.result_info_line.season_info {{resdata.number_of_episodes}} Episodes
        span.last_watched.result_info_line Last Viewed: {{viewed_date}}
      span.result_desciption {{resdata.summary}}
      span.watch_now_btn
        span.play_icon
        span.play_text Watch Now
        span.played_text Watch More
    .clr
.show_nav ng-if="shownav"
  a.next_button.ep_button ng-if="resdata.last_watched" ng-href="/episodes/{{resdata.last_watched.id}}" Last Watched Episode
  a.next_button.ep_button ng-if="resdata.last_watched.next.id" ng-href="/episodes/{{resdata.last_watched.next.id}}" Next Episode
  
```
[^ Go Back To Index](#directiveindex)

###<a name="listFilter"></a> List Filter Directive

This directive provides the ability to show and hide result item information, sort lists results and gives the user to filter lists based on string matches to titles. This directive relies on  Jonny Strömberg's [List.js](http://listjs.com) to do the list filter and sort

**Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L36)**

``` 
watchtoons_directives.directive('listFilter', function() {
  return {
    restrict: 'AC',
    scope: true,
    controller: 'listFilterCtrl'
  };
});
```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L68)**

``` 
watchtoons_controllers.controller('listFilterCtrl',['$scope','$element', '$attrs', function($scope, $element, $attrs) {
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
```

**Template: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/views/angulartemps/_temps.slim#L51)**

``` 
.result_search.result_filter
  input.search type='search' placeholder="Search List" ng-model="searchtext.text" ng-change="searchList(searchtext.text)"
  span.input_label Search
.episode_order_sort.result_sort.result_filter ng-class="{'asecend' : displayorderclass}" ng-click="changeDisplayOrder()"
  span.input_label {{displayorder}}
.show_watched.result_check.result_filter ng-class="{'show' : showwatched}" ng-click="showWatched()"
  span.input_label {{showwatchedtext}}
.list_size.result_check.result_filter ng-class="{'show' : showdescription}" ng-click="showDescription()"
  span.input_label {{showdescriptiontext}}
  
```

[^ Go Back To Index](#directiveindex)

###<a name="spotlightShow"></a> Home Page Spotlight Show Directive

This directive is for the home page slideshow, it make an ajax call to JSON route to get the show data and uses JVasyl Stanislavchuk's [Angular Slick directive](https://github.com/vasyabigi/angular-slick) for the slide show portion 


** Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L44) **

``` 
watchtoons_directives.directive('spotlightShow', function() {
  return {
    restrict: 'ACE',
    scope: true,
    controller: 'spotlightShowCtrl'
  };
});
```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L157)**

``` 
watchtoons_controllers.controller('spotlightShowCtrl',['$scope','$element', '$attrs','$http', function($scope, $element, $attrs, $http) {
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
```

**Template: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/views/spotlights/_spotlight.slim)**

``` 
#spotlight_container (spotlight-show)
  slick#spotlight_show init-onload="true" data="spotData" speed="2500" autoplay="true"  fade="true"
    div.spot_slide ng-repeat="slide in spotData"
      a.spot_slide_link ng-href="/toons/{{slide.id}}"
        img.slide_img.background_img ng-src="{{slide.backdrop}}"
        span.spotlight_info
          img.spotlight_poster.poster_img width="142" ng-src="{{slide.poster}}"
          .spotlight_info_paddingbox
            span.spot_show_title {{slide.name}}
            span.rating_box
              span.rating.spot_show_rating ng-class="{{slide.rating_class}}"
              span.rating_amount {{"( "+slide.text_rating+" ) - "+slide.rating_number+" Votes"}}
            span.spotlight_desciption {{slide.summary}}
            span.button
              | Go To Show Page
```
[^ Go Back To Index](#directiveindex)

###<a name="watchedHistory"></a> Watched History List Directive

This directive is for [My Watched History](http://www.watchtoons.tv/watched-history) section of the site. This section consist of two tabs, one contains the users entire list of watched shows and another of their watched episodes 

** Directive: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/directives.js#L52) **

``` 
senktus_directives.directive('watchedHistory', function() {
  return {
    restrict: 'ACE',
    controller: 'watchedHistoryCtrl'
  };
});

```

**Controller: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/assets/javascripts/angular/controllers.js#L175)**

``` 
watchtoons_controllers.controller('watchedHistoryCtrl',['$scope','$element','historyApi', function($scope,$element,historyApi) {
  $scope.resclass = 'watched_episode_item';
  $scope.shownav = true;
  $scope.epData = $scope.watched_history.episodes;
  $scope.shData = $scope.watched_history.shows;
  $scope.activeTab = "sh"  
}]);

```

**Template: - [File Link](https://github.com/slangberg/watchtoons-frontend/blob/master/app/views/recent_toons/index.html.slim)**

``` 
#watched_tab_holder.tab_holder
  #ep_tab_btn.left_tab.tab ng-class="{'active':activeTab == 'ep'}" ng-click="activeTab = 'ep'"
    | Watched Episodes
  #sh_tab_btn.right_tab.tab ng-class="{'active':activeTab == 'sh'}" ng-click="activeTab = 'sh'"
    | Watched Shows
  #ep_tab.watched_tab ng-show="activeTab == 'ep'"
    h2 
      | Episodes
    ul.list.result_list.episode_list
      li.result_item.episode_item ng-include="'/episodeitem.html'" ng-repeat="resdata in epData"

  #sh_tab.watched_tab ng-show="activeTab == 'sh'"
    h2 
      | Shows
    ul.list.result_list.show_list
      li.result_item.show_item.result-direct id="{{resdata.id}}" resultid="{{resdata.id}}" ng-class="{'watched' : beenwatched}" ng-hide="beenwatched && !showwatched" ng-include="'/showitem.html'" ng-repeat="resdata in shData"
      
```
[^ Go Back To Index](#directiveindex)