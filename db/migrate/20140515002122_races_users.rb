class RacesUsers < ActiveRecord::Migration
  def change
    create_table :races_users, id: false do |t|
      t.belongs_to :race
      t.belongs_to :user
    end
  end
end
