const Contact = require("./schema/contact.js");

const getContacts = async (userId, query) => {
  return await Contact.find({ owner: userId }).populate({
    path: "owner",
    select: "name email",
  });
};

const getContactById = async (userId, contactId) => {
  return await Contact.findById({ _id: contactId, owner: userId }).populate({
    path: "owner",
    select: "email",
  });
};

const removeContact = async (userId, contactId) => {
  return await Contact.findByIdAndRemove({ _id: contactId, owner: userId });
};

const addContact = async (userId, body) => {
  return await Contact.create({ ...body, owner: userId });
};

const updateContact = async (userId, contactId, body) => {
  return await Contact.findOneAndReplace(
    { _id: contactId, owner: userId },
    body,
    {
      new: true,
    }
  );
};

const patchUpdateContact = async (userId, contactId, body) => {
  return await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    body,
    { new: true }
  );
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  patchUpdateContact,
};
