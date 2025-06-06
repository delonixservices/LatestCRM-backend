const Joi = require('@hapi/joi');

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().default('employee'),
});

const validateData = async (req, res, next) => { 
  try {
    const validatedData = await userValidationSchema.validateAsync(req.body);
    req.validatedData = validatedData; 
    next(); 
  } catch (err) {
    res.status(400).json({ error: err.message }); // Better error format
  }
};

module.exports = validateData;
