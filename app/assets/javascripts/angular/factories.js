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

