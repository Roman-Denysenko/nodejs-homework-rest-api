const fs = require("fs/promises");
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

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const dataArr = JSON.parse(data);

    const result = JSON.parse(data).find((el) => el.id === contactId);
    if (!result) {
      throw err;
    }

    dataArr.map((el) => {
      if (el.id === contactId) {
        const index = dataArr.indexOf(el);
        dataArr.splice(index, 1);
        for (let i = 0; i < dataArr.length; i += 1) {
          dataArr[i].id = 1 + i;
        }
        fs.writeFile(contactsPath, JSON.stringify(dataArr), (err) => {
          if (err) throw err;
        });
      }
    });
    console.log("Contact remove success");
    return {
      status: 200,
      message: "contact deleted",
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

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
      if (err) {
        throw err;
      }
    });
    console.log("Contact add success");
    return item;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name = "", email = "", phone = "" } = body;
    const data = await fs.readFile(contactsPath);
    const dataArr = JSON.parse(data);

    const result = dataArr.find((el) => el.id === contactId);
    if (!result) {
      throw err;
    }
    const newItem = {
      id: contactId,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    };
    dataArr.map((el) => {
      if (el.id === contactId) {
        const index = dataArr.indexOf(el);
        dataArr.splice(index, 1, newItem);
        fs.writeFile(contactsPath, JSON.stringify(dataArr), (err) => {
          if (err) throw err;
        });
      }
    });
    return newItem;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const patchUpdateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath);
    const dataArr = JSON.parse(data);

    const result = dataArr.find((el) => el.id === contactId);
    if (!result) {
      throw err;
    }

    const {
      name = result.name,
      email = result.email,
      phone = result.phone,
    } = body;

    const newItem = {
      id: contactId,
      name: `${name}`,
      email: `${email}`,
      phone: `${phone}`,
    };
    dataArr.map((el) => {
      if (el.id === contactId) {
        const index = dataArr.indexOf(el);
        dataArr.splice(index, 1, newItem);
        fs.writeFile(contactsPath, JSON.stringify(dataArr), (err) => {
          if (err) throw err;
        });
      }
    });
    return newItem;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  patchUpdateContact,
};
