const fs = require("fs/promises");
const contacts = require("./contacts.json");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const result = JSON.parse(data);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const result = JSON.parse(data).find((el) => el.id === contactId);
    if (!result) {
      throw err;
    }
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const data = await fs.readFile(contactsPath);
    const dataArr = JSON.parse(data);
    const id = dataArr.length + 1;
    const item = {
      id: id,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    };

    dataArr.push(item);
    fs.writeFile(contactsPath, JSON.stringify(dataArr), (error) => {
      if (err) throw err;
    });
    console.log("Contact add success");
    return dataArr;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
