const express = require("express");
const router = express.Router();
const validator = require("../../valid-users-contacts.js");
const ctrl = require("../../../controllers/contacts.js");

router.get("/", ctrl.listContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validator.createContact, ctrl.addContact);

router.delete("/:contactId", ctrl.removeContact);

router.put("/:contactId", validator.updateContact, ctrl.updateContact);

router.patch("/:contactId", validator.updateContact, ctrl.patchUpdateContact);

router.patch(
  "/:contactId/favorite",
  validator.updateStatusContact,
  ctrl.updateStatusContact
);

module.exports = router;
