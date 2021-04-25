const Contact = require("./schema/contact.js");

const getContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId);
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findOneAndReplace({ _id: contactId }, body, {
    new: true,
  });
};

const patchUpdateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  patchUpdateContact,
};
