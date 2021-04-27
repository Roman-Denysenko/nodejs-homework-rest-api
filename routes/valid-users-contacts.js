const Joi = require("joi");

const schemaCreate = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdate = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string().optional(),
}).or("name", "email", "phone");

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().only().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    return next();
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

const createContact = async (req, res, next) => {
  return await validate(schemaCreate, req.body, next);
};
const updateContact = async (req, res, next) => {
  return await validate(schemaUpdate, req.body, next);
};

const updateStatusContact = async (req, res, next) => {
  return await validate(schemaUpdateStatusContact, req.body, next);
};

module.exports = {
  createContact,
  updateContact,
  updateStatusContact,
};
