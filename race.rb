class Race < ActiveRecord::Base
  has_and_belongs_to_many :users
  belongs_to :track

  validates_presence_of :name

  before_create :set_initial_arsenals, :set_initial_positions

  def to_s
    name
  end

  def arsenals
    JSON.parse(read_attribute(:arsenals))
  end

  def positions
    JSON.parse(read_attribute(:positions))
  end

  def arsenal_for(user)
    arsenals[user.id.to_s]
  end

  def active_player
    users.first
  end

  private

  def set_initial_positions
    positions = {}
    users.each do |user|
      positions[user.id] = {}
      positions[user.id][0] = {
        :x => nil,
        :y => nil,
      }
    end
    write_attribute(:positions, positions.to_json)
  end

  def set_initial_arsenals
    arsenals = {}
    users.each do |user|
      arsenals[user.id] = {
        :booster => 0,
        :rocket => 0,
        :mine => 0,
      }
    end
    write_attribute(:arsenals, arsenals.to_json)
  end

end
