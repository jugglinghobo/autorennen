require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/flash'
require 'json'
require 'pry'
require 'logger'

require 'haml'
require 'sass'

require './environment'
require './user'
require './race'
require './track'
require './tile'



Dir.mkdir('logs') unless File.exist?('logs')
$log = Logger.new('logs/output.log','weekly')

configure :production do
  $log.level = Logger::WARN
  set :debugging, false
end
configure :development do
  $log.level = Logger::DEBUG
  set :debugging, true
end

enable :sessions

get '/' do
  haml :"races/index"
end

get '/debugging.json' do
  {:debugging => settings.debugging}.to_json
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

get '/users/:id.json' do
  authenticate!
  get_user
  @user.to_json
end

get '/users/:id' do
  authenticate!
  get_user
  haml :"users/form"
end

post '/users/:id/update' do
  authenticate!
  get_user
  if @user.update_attributes params[:user]
    flash[:success] = "changes saved"
    redirect to "/users/#{@user.id}"
  else
    flash.now[:error] = "changes could not be saved"
    haml :"users/form"
  end
end

get '/races' do
  authenticate!
  @races = Race.all
  haml :"races/index"
end

get '/races/new' do
  authenticate!
  @race = Race.new
  haml :"races/new"
end

post '/races/create' do
  authenticate!
  @race = Race.new params[:race]
  if @race.save
    flash[:success] = "race created"
    redirect to "/races/#{@race.id}"
  else
    flash.now[:error] = "race could not be created"
    haml :"races/new"
  end
end

post '/races/:id/update' do
  authenticate!
  get_race
  puts params[:race].inspect
  if @race.update_attributes params[:race]
    flash[:success] = "move saved"
    @race.to_json
  else
    {:message => "move could not be saved", :error => true, :status => 400}.to_json
  end
end

post '/races/:id/delete' do
  authenticate!
  get_race
  if @race.destroy
    flash[:success] = "race deleted"
    redirect to "/"
  else
    flash.now[:error] = "race could not be deleted"
    haml :"races/show"
  end
end

get '/races/:id.json' do
  authenticate!
  get_race
  @race.to_json(:include => [:users, :active_player])
end

get '/races/:id' do
  authenticate!
  get_race
  haml :"races/show"
end

get '/tracks' do
  authenticate!
  haml :tracks
end

get '/tracks/new.json' do
  authenticate!
  @track = Track.new
  @track.to_json
end

get '/tracks/new' do
  authenticate!
  @track = Track.new
  haml :"tracks/form"
end

get '/tracks/:id/edit' do
  authenticate!
  get_track
  haml :"tracks/form"
end

post '/tracks/create' do
  authenticate!
  preprocess_tile_params!
  @track = Track.new params[:track]
  if @track.valid?
    @track.save
    flash[:success] = "track saved"
    @track.to_json
  else
    {:message => "track could not be saved", :error => true, :status => 400}.to_json
  end
end

post '/tracks/:id/update' do
  puts params[:track].inspect
  authenticate!
  preprocess_tile_params!
  get_track
  if @track.update_attributes params[:track]
    flash[:success] = "track saved"
    @track.to_json
  else
    {:message => "track could not be saved", :error => true, :status => 400}.to_json
  end
end

post '/tracks/:id/delete' do
  authenticate!
  get_track
  if @track.destroy
    flash[:success] = "track deleted"
    redirect to '/'
  else
    {:message => "track could not be deleted", :error => true, :status => 400}.to_json
  end
end


get '/tracks/:id.json' do
  authenticate!
  get_track
  @track.to_json
end

get '/tracks/:id' do
  authenticate!
  get_track
  haml :"tracks/show"
end


def authenticate!
  unless current_user
    flash[:error] = "you need to login for this action"
    redirect to "/"
  end
end

def preprocess_tile_params!
  params[:track][:tiles] ||= {}
end

def get_user
  @user = User.find params[:id]
end

def get_race
  @race = Race.find params[:id]
end

def get_track
  @track = Track.find params[:id]
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

helpers do
  def current_user
    if session[:user_id]
      User.find session[:user_id]
    end
  end

  def can_play?(user)
    raise "instance variable @race not set" unless @race
    settings.debugging || (user == @race.active_player)
  end

  def debugging(&block)
    if block_given?
      css_class = "debugging"
      css_class += " hidden" unless settings.debugging
      div = "<div class='#{css_class}'>#{block.call}</div>"
      puts "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
      puts div
      puts "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&"
      div
    else
      settings.debugging
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
end
