class Track < ActiveRecord::Base
  INT_ATTRS = ["x", "y", "column", "row", "size"]
  validates_presence_of :name, :user, :columns, :rows

  belongs_to :user
  has_many :races

  alias_method :creator, :user

  def to_s
    name
  end

  def tiles
    JSON.parse(read_attribute(:tiles))
  end

  def tiles=(tiles_hash)
    tiles_hash.values.each do |tile|
      tile.each do |attribute, value|
        tile[attribute] = value.to_i if INT_ATTRS.include?(attribute)
      end
    end

    write_attribute(:tiles, tiles_hash.values.to_json)
  end
end
