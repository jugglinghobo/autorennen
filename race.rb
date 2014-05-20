class Race < ActiveRecord::Base
  has_and_belongs_to_many :users
  belongs_to :track
  belongs_to :active_player, :class_name => "User"
  belongs_to :initial_player, :class_name => "User"

  validates_presence_of :name

  before_create :set_initial_arsenals, :set_initial_positions, :set_initial_active_player, :set_initial_player

  before_update :after_play

  def to_s
    name
  end

  def arsenals
    JSON.parse(read_attribute(:arsenals))
  end

  def positions=(positions_hash)
   write_attribute(:positions, positions_hash.to_json)
  end

  def positions
    JSON.parse(read_attribute(:positions))
  end

  def arsenal_for(user)
    arsenals[user.id.to_s]
  end

  private

  def after_play
    next_index = (users.index(active_player)+1) % users.count
    self.active_player = users[next_index]
    #set_next_positions
    if active_player == initial_player
      self.turn += 1
    end
  end

  def set_next_positions
    current_positions = self.positions
    current_positions[active_player.id.to_s][(turn+1)] = {:x => next_position(:x), :y => next_position(:y)}
    self.positions = current_positions
  end

  def set_initial_active_player
    self.active_player = users.sample
  end

  def set_initial_player
    self.initial_player = self.active_player
  end

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
