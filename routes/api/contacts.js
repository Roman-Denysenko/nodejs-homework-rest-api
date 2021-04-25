const express = require("express");
const router = express.Router();
const validator = require("../valid-users-contacts.js");
const mdl = require("../../model/contacts.js");

router.get("/", mdl.listContacts);

router.get("/:contactId", mdl.getContactById);

router.post("/", validator.createContact, mdl.addContact);

router.delete("/:contactId", mdl.removeContact);

router.put("/:contactId", validator.updateContact, mdl.updateContact);

router.patch("/:contactId", validator.updateContact, mdl.patchUpdateContact);

router.patch(
  "/:contactId/favorite",
  validator.updateStatusContact,
  mdl.updateStatusContact
);

module.exports = router;
