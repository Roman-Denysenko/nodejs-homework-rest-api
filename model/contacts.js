const service = require("../service");
//const fs = require("fs/promises");
// const path = require("path");

// const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async (req, res, next) => {
  try {
    const result = await service.getContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        contacts: result,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await service.getContactById(contactId);

    if (!result) {
      next(err);
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await service.removeContact(contactId);

    if (!result) {
      next(err);
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
};

const addContact = async (req, res, next) => {
  try {
    const body = req.body;
    const result = await service.addContact(body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;

    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields",
      });
    }

    const result = await service.updateContact(contactId, body);
    if (!result) {
      next(err);
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
};

const patchUpdateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;
    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields",
      });
    }

    const result = await service.patchUpdateContact(contactId, body);
    if (!result) {
      next(err);
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const body = req.body;
    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields favorite",
      });
    }

    const result = await service.patchUpdateContact(contactId, body);
    if (!result) {
      next(err);
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  patchUpdateContact,
  updateStatusContact,
};
