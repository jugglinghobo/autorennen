class Track < ActiveRecord::Base
  validates_presence_of :name, :creator

  belongs_to :creator, :class_name => "User"

  def to_s
    name
  end

  def tiles
    JSON.parse(read_attribute(:tiles))
  end

  def tiles=(tiles_hash)
    tiles_hash.values.each do |tile|
      tile.each do |attribute, value|
        tile[attribute] = value.to_i
      end
    end

    write_attribute(:tiles, tiles_hash.values.to_json)
  end

  #def serialize_tiles=(tile_hash)
  #  puts "SERIALIZE TILES"
  #  puts tile_hash.inspect
  #  puts "_DNI_"

  #  # serialize params of form {"0" => {"0" => {"x" => "0", "y" => "0" etc. }}}
  #  # to a nested array form, then set tiles to it's json representation
  #  #
  #  # the final grid, a two dimensional array (columns, rows)
  #  array_grid = [[]]

  #  tile_hash.values.each do |indexed_tiles|
  #    puts "indexed_tiles: "
  #    puts indexed_tiles.inspect
  #    indexed_tiles.values.each do |tile|
  #      puts "tile:"
  #      puts tile.inspect
  #      # convert tile's string values to ints
  #      tile.each do |attribute, value|
  #        puts "attr, val"
  #        puts "#{attribute}, #{value}"
  #        tile[attribute] = value.to_i
  #      end

  #      # add tile to array at tile's position
  #      array_grid[tile["column"]] ||= []
  #      array_grid[tile["column"]][tile["row"]] = tile
  #    end
  #  end
  #  puts "FINISHED:"
  #  puts array_grid
  #  @tiles = array_grid.to_json
  #end
end
