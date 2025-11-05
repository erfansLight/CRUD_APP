import { Register } from "../../services/user/registration.service.js";
import Joi from 'joi'


const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const register = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(5).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')).required(),
      phonenumber: Joi.string().length(11).pattern(new RegExp('(09)[0-9]{9}')).required()
    });

    const validate = schema.validate(req.body);
    const { error } = validate;
    if (error) {
      return res.status(400).json(validate.error.details[0].message);
    }


    const { name, email, password, phonenumber } = req.body;
    const result = await Register(name, email, password, phonenumber);

    if (!result) {
      return handleResponse(res, 409, "Email or phonenumber already registered");
    } else {
      return handleResponse(res, 201, "User registered successfully", result);
    }

  } catch (error) {
    next(error);
  }
};
