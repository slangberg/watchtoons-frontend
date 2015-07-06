module EpisodesHelper
  def episode_missing?(episode)
    if data = episode.anime_flavor_embed_data
      !data['src']
    end
  end
end
