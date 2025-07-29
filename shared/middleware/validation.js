const ApiResponse = require('../utils/responseFormatter');

const validate = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      const response = ApiResponse.validation(errors);
      return res.status(response.statusCode).json(response);
    }

    next();
  };
};

module.exports = validate;
