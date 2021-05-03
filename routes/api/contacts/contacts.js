const express = require("express");
const router = express.Router();
const validator = require("../../valid-users-contacts.js");
const ctrl = require("../../../controllers/contacts.js");
const guard = require("../../../helpers/guard.js");

router.get("/", guard, validator.validQueryContact, ctrl.listContacts);

router.get("/:contactId", guard, ctrl.getContactById);

router.post("/", guard, validator.createContact, ctrl.addContact);

router.delete("/:contactId", guard, ctrl.removeContact);

router.put("/:contactId", guard, validator.updateContact, ctrl.updateContact);

router.patch(
  "/:contactId",
  guard,
  validator.updateContact,
  ctrl.patchUpdateContact
);

router.patch(
  "/:contactId/favorite",
  guard,
  validator.updateStatusContact,
  ctrl.updateStatusContact
);

module.exports = router;
