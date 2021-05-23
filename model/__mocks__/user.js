const { User, users } = require("./data");

const findById = jest.fn((id) => {
  const [user] = users.filter((el) => String(el._id) === String(id));
  return user;
});

const findByEmail = jest.fn((email) => {
  const [user] = users.filter((el) => String(el.email) === String(email));
  return user;
});

const updateAvatar = jest.fn((id, avatar, idAvatarFromCloud = null) => {
  const [user] = users.filter((el) => String(el._id) === String(id));
  user.avatarURL = avatar;
  user.idAvatarFromCloud = idAvatarFromCloud;

  return user;
});

module.exports = {
  updateAvatar,
  findById,
  findByEmail,
};
