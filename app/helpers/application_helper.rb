module ApplicationHelper
  def dynamic_body_class
    "#{params[:controller]}_#{action_name}"
  end
end
