SEARCH_PATH = '/search'

setup_engine = ->

  engine_opts =
    name: 'toon_adapter'
    remote: {
      url: "#{SEARCH_PATH}?q=%QUERY"
      filter: (datums) ->
        $.map(datums, (suggestion, i) ->
          name: suggestion.name
          url:  suggestion.url
          id:   suggestion.id
          poster: suggestion.poster 
          number_of_episodes: suggestion.number_of_episodes 
        )
    }
    queryTokenizer: Bloodhound.tokenizers.whitespace
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name')
    dupDetector: (remoteMatch, localMatch) ->
      is_duplicate = remoteMatch.name == localMatch.name
      is_duplicate
    sorter: (datums, nada) ->

  engine = new Bloodhound(engine_opts)
  engine.initialize()
  engine

engine = setup_engine()

$ ->
  $input = $('.site_search_box')

  onAutocompleted = (e, datum) ->
    window.location.href = datum.url

  $input.typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  }, {
    name: 'toon_adapter'
    # displayKey: 'name'
    source: engine.ttAdapter()
    templates: {
      suggestion:(data) -> 
        "<div class='search_result'>
          <img src='#{data.poster}'class='search_result_thumb'/>
          <div class='search_result_text'>
            <span class='search_result_name'>#{data.name}</span>
            <span class='search_result_length'>#{data.number_of_episodes} Episodes</span>
          </div>
          <div class='clr'>
        </div>"
    }                                                          
  }).on('typeahead:selected', (event, data) -> onAutocompleted(event, data))


