const contacts = [
  {
    _id: "608fe783c910320f2c1c70ca",
    favorite: false,
    name: "drn",
    email: "qwe@mail.com",
    phone: "879878787",
    owner: "608fba0dd129c712847b44af",
    __v: 0,
  },
  {
    _id: "609054e7c177881288972e1a",
    favorite: false,
    name: "drn1",
    email: "qwe@mail.com",
    phone: "879878787",
    owner: "608fba0dd129c712847b44af",
    __v: 0,
  },
];

const newContact = {
  name: "New",
  phone: "123456789",
};

const User = {
  _id: "60a3d73ae962c40a081ce148",
  subscription: "starter",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTNkNzNhZTk2MmM0MGEwODFjZTE0OCIsImlhdCI6MTYyMTM1MDI2OSwiZXhwIjoxNjIxMzcxODY5fQ.Dh9dXdbVCHPQqH9pD8m8Bb64mZDkb6245erBb06TFPo",
  idAvatarFromCloud: null,
  verify: true,
  verifyToken: null,
  email: "roman_denisenko@ukr.net",
  password: "$2a$06$q76k8fZNCOQDYFVMMG.o4.mda5rlyo9by6LEh8VaVHlZ6zf/nNATW",
  avatarURL:
    "https://secure.gravatar.com/ed32b908999366e795db4258d2ef2a77.json?s=250",
  __v: 0,
};

const users = [];
users[0] = User;

const newUser = { email: "test@test.com", password: "123456" };

module.exports = { contacts, newContact, User, users, newUser };
