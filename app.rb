require 'sinatra'
require 'sinatra/activerecord'
require 'json'
require './environment'

require 'haml'
require 'sass'

get '/' do
  haml :index
end

# sass stylesheet hack
SASS_DIR = File.expand_path("../public/stylesheets", __FILE__)
get "/stylesheets/:stylesheet.css" do |stylesheet|
  content_type "text/css"
  template = File.read(File.join(SASS_DIR, "#{stylesheet}.scss"))
  scss template
end

