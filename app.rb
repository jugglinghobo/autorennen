require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/flash'
require 'json'

require 'haml'
require 'sass'

require './environment'
require './user'
require './race'
require './track'

enable :sessions

get '/' do
  haml :index
end

post '/login' do
  if (user = User.find_by_username(params[:username])) && (user.password == params[:password])
    login(user)
    flash[:success] = "logged in"
    redirect to params[:location]
  else
    flash[:error] = "not logged in"
    redirect to params[:location]
  end
end

get '/logout' do
  logout
  flash[:success] = "logged out"
  redirect to '/'
end

get '/users/:id' do
  @user = User.find params[:id]
  haml :"users/form"
end

get '/races' do
  @races = Race.all
  haml :"races/index"
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

def login(user)
  session[:user_id] = user.id
end

def logout
  session[:user_id] = nil
end

def current_user
  if session[:user_id]
    User.find session[:user_id]
  end
end

def flash_class(level)
  case level
    when :notice then "alert alert-info"
    when :success then "alert alert-success"
    when :alert then "alert alert-warning"
    when :error then "alert alert-danger"
  end
end
