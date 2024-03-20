import Joi from 'joi';

export function validateRegister(body) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(6).max(20).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    name: Joi.string().min(3).max(24).required(),
    address: AddressSchema.required(),
    mobileNo: Joi.string().required(),
    education: Joi.array().items(educationSchema).required(),
    language: Joi.string().valid('tr', 'en').required(),
    platform: Joi.string().valid('Android', 'IOS').required(),
    timezone: Joi.number().required(),
    deviceId: Joi.string().min(4).required()
  });
  return schema.validate(body);
}

const AddressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.string().required(),
  country: Joi.string().required()
});

const educationSchema = Joi.object({
  _id: Joi.string(),
  degree: Joi.string().required(),
  major: Joi.string().required(),
  university: Joi.string().required(),
  graduationYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
});

export function validateLogin(body) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required(),
    password: Joi.string().min(6).max(20).required()
  });
  return schema.validate(body);
}

export function validateSendVerificationCode(body) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).required()
  });
  return schema.validate(body);
}

export function validateVerifyEmail(body) {
  const schema = Joi.object({
    token: Joi.string().min(10).required(),
    code: Joi.string().length(4).required()
  });
  return schema.validate(body);
}

export function validateRefreshToken(body) {
  const schema = Joi.object({
    refreshToken: Joi.string().min(10).required()
  });
  return schema.validate(body);
}

export function validateForgotPassword(body) {
  const schema = Joi.object({
    password: Joi.string().min(6).max(20).required()
  });
  return schema.validate(body);
}

export function validateChangePassword(body) {
  const schema = Joi.object({
    oldPassword: Joi.string().min(6).max(20).required(),
    newPassword: Joi.string().min(6).max(20).required()
  });
  return schema.validate(body);
}

export function validateEditUser(body) {
  const schema = Joi.object({
    email: Joi.string().email().min(3),
    firstName: Joi.string(),
    lastName: Joi.string(),
    address: AddressSchema,
    mobileNo: Joi.string(),
    education: Joi.array().items(educationSchema),
    photoUrl: Joi.string()
  });
  return schema.validate(body);
} 