class Track < ActiveRecord::Base
  validates_presence_of :name, :creator

  def to_s
    name
  end
end
