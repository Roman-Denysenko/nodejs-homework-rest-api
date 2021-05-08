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

const updateSubscription = async (id, valueSubscription) => {
  return await User.findByIdAndUpdate(
    id,
    { subscription: valueSubscription },
    {
      new: true,
    }
  );
};

const updateAvatar = async (id, avatar, idAvatarFromCloud = null) => {
  return await User.findByIdAndUpdate(
    id,
    {
      avatarURL: avatar,
      idAvatarFromCloud,
    },
    {
      new: true,
    }
  );
};

module.exports = {
  findById,
  findByEmail,
  createUser,
  updateToken,
  updateSubscription,
  updateAvatar,
};
