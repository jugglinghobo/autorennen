class Track < ActiveRecord::Base
  validates_presence_of :name, :creator
  has_many :tiles
  belongs_to :creator, :class_name => "User"

  def to_s
    name
  end

  def tile_grid
    grid = []
    columns.times do |col|
      grid[col] = []
      rows.times do |row|
        grid[col][row] = tiles.find_by_column_and_row(col, row)
      end
    end
    grid
  end

end
