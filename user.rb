require 'bcrypt'

class User < ActiveRecord::Base
  include BCrypt
  has_and_belongs_to_many :races

  has_many :tracks

  after_initialize :set_random_color

  validates_presence_of :username, :password_hash

  def to_s
    username
  end

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
  end

  private

  def set_random_color
    self.color ||= "#%06x" % (rand * 0xffffff)
  end

end
