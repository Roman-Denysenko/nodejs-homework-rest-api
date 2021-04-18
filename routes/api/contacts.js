const express = require("express");
const router = express.Router();
const contacts = require("../../model/index.js");
const validator = require("../valid-users-contacts.js");

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const id = Number(req.params.contactId);
    const result = await contacts.getContactById(id);
    res.json(result);
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

router.post("/", validator.createContact, async (req, res, next) => {
  try {
    const body = req.body;
    const result = await contacts.addContact(body);
    res.status(201).json({
      status: 201,
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const id = Number(req.params.contactId);
    const result = await contacts.removeContact(id);
    res.json(result);
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

router.put("/:contactId", validator.updateContact, async (req, res, next) => {
  try {
    const body = req.body;
    const id = Number(req.params.contactId);
    const result = await contacts.updateContact(id, body);

    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields",
      });
    }
    res.status(200).json({
      status: 200,
      ...result,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

router.patch("/:contactId", validator.updateContact, async (req, res, next) => {
  try {
    const body = req.body;
    const id = Number(req.params.contactId);
    const result = await contacts.patchUpdateContact(id, body);

    if (body.constructor === Object && Object.keys(body).length === 0) {
      res.status(400).json({
        status: 400,
        message: "missing fields",
      });
    }
    res.status(200).json({
      status: 200,
      ...result,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "Not found",
    });
  }
});

module.exports = router;
