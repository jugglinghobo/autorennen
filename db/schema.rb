# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140515002122) do

  create_table "races", force: true do |t|
    t.string   "name"
    t.integer  "turn",       default: 0
    t.text     "arsenals",   default: "{}"
    t.text     "positions",  default: "{}"
    t.integer  "track_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "races_users", id: false, force: true do |t|
    t.integer "race_id"
    t.integer "user_id"
  end

  create_table "tiles", force: true do |t|
    t.integer  "x"
    t.integer  "y"
    t.integer  "size"
    t.integer  "column"
    t.integer  "row"
    t.integer  "track_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tracks", force: true do |t|
    t.string   "name"
    t.integer  "columns",    default: 50
    t.integer  "rows",       default: 60
    t.integer  "tile_size",  default: 15
    t.integer  "user_id"
    t.text     "tiles",      default: "[]"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "teamname"
    t.string   "password_hash"
    t.string   "color"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
