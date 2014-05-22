class CreateTracks < ActiveRecord::Migration
 def change
   create_table :tracks do |t|
     t.string :name
     t.integer :columns, :default => 50
     t.integer :rows, :default => 60
     t.integer :tile_size, :default => 15
     t.references :user
     t.text :tiles, :default => "[]"
     t.text :pickups, :default => "[]"
     t.timestamps
   end
 end

end
