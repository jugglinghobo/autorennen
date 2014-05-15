class CreateRaces < ActiveRecord::Migration
  def change
   create_table :races do |t|
     t.string :name
     t.integer :turn, :default => 0
     t.text :arsenals, :default => "{}"
     t.text :positions, :default => "{}"
     t.belongs_to :track
     t.timestamps
   end
  end
end
