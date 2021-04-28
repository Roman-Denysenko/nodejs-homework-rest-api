const Service = require("../service/contact.js");
const mongoose = require("mongoose");

const listContacts = async (req, res, next) => {
  try {
    const result = await Service.getContacts();
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
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({ status: 400, message: "Invalid Object Id" });
    }
    const result = await Service.getContactById(contactId);

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
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({ status: 400, message: "Invalid Object Id" });
    }

    const result = await Service.removeContact(contactId);

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
    const result = await Service.addContact(body);
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
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({ status: 400, message: "Invalid Object Id" });
    }
    const body = req.body;

    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields",
      });
    }

    const result = await Service.updateContact(contactId, body);
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
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({ status: 400, message: "Invalid Object Id" });
    }
    const body = req.body;
    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields",
      });
    }

    const result = await Service.patchUpdateContact(contactId, body);
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
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({ status: 400, message: "Invalid Object Id" });
    }
    const body = req.body;
    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields favorite",
      });
    }

    const result = await Service.patchUpdateContact(contactId, body);
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
