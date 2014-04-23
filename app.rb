require 'sinatra'
require 'sinatra/activerecord'
require 'json'

require "dm-core"
require "dm-migrations"
require "digest/sha1"
require 'rack-flash'
require "sinatra-authentication"

require 'haml'
require 'sass'

require './environment'
require './track'

use Rack::Session::Cookie, :secret => '-ja1w{Lb082ZwuLg*1EkznB1*6B8[3'
use Rack::Flash

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

