require 'sinatra'
require 'sinatra/activerecord'
require 'json'
require './environment'

require 'haml'
require 'sass'

require './track'

post '/login' do
  user = User.find_by_username params[:username]
end

get '/' do
  haml :index
end

get '/tracks' do
  haml :tracks
end

get '/tracks/form' do
  @track = Track.new
  haml :"tracks/form"
end

# sass stylesheet hack
SASS_DIR = File.expand_path("../public/stylesheets", __FILE__)
get "/stylesheets/:stylesheet.css" do |stylesheet|
  content_type "text/css"
  template = File.read(File.join(SASS_DIR, "#{stylesheet}.scss"))
  scss template
end

