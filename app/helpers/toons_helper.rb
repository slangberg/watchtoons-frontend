require_relative '../../lib/core/rounding'

module ToonsHelper

  def css_rating_id(toon)
    if rating = toon.rating_percentage.to_s
      "r_#{rating.gsub('.', '_')}"
    end
  end

  def text_rating(toon)
    toon.rating_percentage.to_s
  end

  # def css_rating_class(toon)
  #   "r_#{toon.id}"
  # end

  def unique_id_for(obj)
    prefix = obj.class.name.downcase
    "#{prefix}_#{obj.id}"
  end

  def first_episode
    @toon.episodes.first if @toon
  end

  def number_of_seasons_txt
    if num  = @toon.number_of_seasons
      num > 1 ? "#{num} Seasons" : "1 Season"
    end if @toon
  end

  def space_to_hypen(str)
    str.gsub(' ', '-')
  end

  def hyphen_to_space(str)
    str.gsub('-', ' ')
  end
end
