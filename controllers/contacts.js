const Service = require("../service/contact.js");
const mongoose = require("mongoose");
const { HttpCode } = require("../helpers/constants.js");

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const result = await Service.getContacts(userId, req.query);
    res.json({
      status: "success",
      code: HttpCode.SUCCESS,
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
    const userId = req.user?.id;
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: "Invalid Object Id",
      });
    }
    const result = await Service.getContactById(userId, contactId);

    if (!result) {
      next(err);
    }
    res.json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(HttpCode.NOT_FOUND).json({
      status: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: "Invalid Object Id",
      });
    }

    const result = await Service.removeContact(userId, contactId);

    if (!result) {
      next(err);
    }
    res.json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(HttpCode.NOT_FOUND).json({
      status: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const body = req.body;
    const result = await Service.addContact(userId, body);
    res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
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
    const userId = req.user?.id;
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: "Invalid Object Id",
      });
    }
    const body = req.body;

    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        message: "missing fields",
      });
    }

    const result = await Service.updateContact(userId, contactId, body);
    if (!result) {
      next(err);
    }

    res.json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(HttpCode.NOT_FOUND).json({
      status: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  }
};

const patchUpdateContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: "Invalid Object Id",
      });
    }
    const body = req.body;
    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        message: "missing fields",
      });
    }

    const result = await Service.patchUpdateContact(userId, contactId, body);
    if (!result) {
      next(err);
    }

    res.json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(HttpCode.NOT_FOUND).json({
      status: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: "Invalid Object Id",
      });
    }
    const body = req.body;
    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: HttpCode.BAD_REQUEST,
        message: "missing fields favorite",
      });
    }

    const result = await Service.patchUpdateContact(userId, contactId, body);
    if (!result) {
      next(err);
    }

    res.json({
      status: "success",
      code: HttpCode.SUCCESS,
      data: {
        contact: result,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(HttpCode.NOT_FOUND).json({
      status: HttpCode.NOT_FOUND,
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
