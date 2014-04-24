require 'bcrypt'

class User < ActiveRecord::Base
  include BCrypt

  validates :username, :password_hash, :presence => true

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
end
