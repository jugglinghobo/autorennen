class Race < ActiveRecord::Base
  INT_ATTRS = ["x", "y", "size"]

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

  def arsenals=(arsenals_hash)
    # convert coordinate values from strings to ints
    arsenals_hash.each do |user_id, pickup_hash|
      pickup_hash.keys.each do |pickup|
        safe_to_i(pickup_hash, pickup)
      end
    end
    write_attribute(:arsenals, arsenals_hash.to_json)
  end

  def arsenals
    JSON.parse(read_attribute(:arsenals))
  end

  def positions=(positions_hash)
    # convert coordinate values from strings to ints
    positions_hash.each do |user_id, turn_hash|
      turn_hash.each do |turn, positions|
        ["x", "y"].each do |coordinate|
          safe_to_i(positions, coordinate)
        end
      end
    end
    write_attribute(:positions, positions_hash.to_json)
  end

  def positions
    JSON.parse(read_attribute(:positions))
  end

  def items=(items_hash)
    items_hash.values.each do |item|
      item.each do |attribute, value|
        item[attribute] = value.to_i if INT_ATTRS.include?(attribute)
      end
    end

    write_attribute(:items, items_hash.values.to_json)
  end

  def items
    JSON.parse(read_attribute(:items))
  end

  def arsenal_for(user)
    arsenals[user.id.to_s]
  end

  private

  def after_play
    next_index = (users.index(active_player)+1) % users.count
    self.active_player = users[next_index]
    if active_player == initial_player
      self.turn += 1
    end
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

  def safe_to_i(positions, coordinate)
    positions[coordinate] = positions[coordinate].to_i if positions[coordinate].match(/\A\d+\Z/)
  end

end
