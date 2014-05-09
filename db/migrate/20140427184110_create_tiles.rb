class CreateTiles < ActiveRecord::Migration
  def change
   create_table :tiles do |t|
     t.integer :x
     t.integer :y
     t.integer :size
     t.integer :column
     t.integer :row
     t.references :track
     t.timestamps
   end
  end
end
