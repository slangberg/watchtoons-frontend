# json.extract! @toon, :id, :name, :summary, :number_of_episodes, :release_date, :backdrop, :poster, :created_at, :updated_at
# json.data do
#     json.array! @toons
# end

json.data @toons do |toon|
  json.name toon.name
  json.id toon.id
  json.summary toon.summary
  json.backdrop toon.backdrop
  json.poster toon.poster
  json.rating_class(css_rating_id(toon))
  json.text_rating(text_rating(toon))
  json.rating_number toon.ann_rating['number']
end