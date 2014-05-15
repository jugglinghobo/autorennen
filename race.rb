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
    # convert string keys to ints
    positions_hash.keys.each do |user_id|
      positions_hash[user_id].keys.each do |turn|
        positions_hash[user_id][turn.to_i] = positions_hash[user_id].delete(turn)
      end
      positions_hash[user_id.to_i] = positions_hash.delete(user_id)
    end
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
    set_next_positions
    self.active_player = users[next_index]
    if active_player == initial_player
      self.turn += 1
    end
  end

  def set_next_positions
    current_positions = self.positions
    current_positions[active_player.id.to_s][(turn+1).to_s] = {:x => next_position(:x), :y => next_position(:y)}
    self.positions = current_positions
  end

  def next_position(direction)
    last_position = self.positions[active_player.id.to_s][(turn-1).to_s]
    current_position = self.positions[active_player.id.to_s][turn.to_s]
    if last_position
      current_position[direction.to_s].to_i + (current_position[direction.to_s].to_i - last_position[direction.to_s].to_i)
    else
      current_position[direction.to_s].to_i
    end
  end

  def set_initial_active_player
    puts "USERS"
    puts users.inspect
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
