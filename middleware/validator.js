const { body, validationResult } = require("express-validator");

//check if the route parameter is a valid objectId value
exports.validateId = (req, res, next) => {
  let id = req.params.id;
  //an objectId is a 24-bit Hex string
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid story id");
    err.status = 400;
    return next(err);
  } else {
    next();
  }
};

exports.validateSignUp = [
  body("firstName", "First name cannot be empty").notEmpty().trim().escape(),
  body("lastName", "Last name cannot be empty").notEmpty().trim().escape(),
  body("email", "Email must be a valid email address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64 characters"
  ).isLength({ min: 8, max: 64 }),
];

exports.validateLogIn = [
  body("email", "Email must be a valid email address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64 characters"
  ).isLength({ min: 8, max: 64 }),
];

exports.validateEvent = [
  body("category", "Category must be Food or Sports")
    .notEmpty()
    .trim()
    .escape()
    .isIn(["food", "sports"]),
  body("title", "Title cannot be empty").notEmpty().trim().escape(),
  body("details", "Event details must contain at least 10 characters")
    .isLength({ min: 10 })
    .trim()
    .escape(),
  body("location", "Location cannot be empty").notEmpty().trim().escape(),
  body("start", "Start field cannot be empty")
    .notEmpty()
    .trim()
    .escape()
    .isISO8601(),
  // body('end', 'End field cannot be empty')
  //   .notEmpty()
  //   .trim()
  //   .escape()
  //   .isISO8601(),
];

exports.validateResult = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("back");
  } else {
    return next();
  }
};
