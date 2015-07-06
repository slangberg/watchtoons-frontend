json.array!(@toons) do |toon|
  json.extract! toon, :id, :name, :poster, :number_of_episodes
  json.url toon_path(toon)
end

