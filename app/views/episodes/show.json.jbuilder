next_episode = @episode.next
previous_episode = @episode.previous

json.extract! @episode, :id, :name, :number, :created_at, :updated_at
json.episode(@episode)

if previous_episode
	json.previous({ id: previous_episode.id, name: previous_episode.name, tvdb_name: previous_episode.tvdb_name})
end

if next_episode
	json.next({ id: next_episode.id, name: next_episode.name, tvdb_name: next_episode.tvdb_name})
end

json.merge!(toon: @episode.toon.attributes)
