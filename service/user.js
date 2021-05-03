const User = require("./schema/user.js");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userOptions) => {
  return await User.create(userOptions);
};

const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate(id, { token });
};

module.exports = {
  findById,
  findByEmail,
  createUser,
  updateToken,
};
