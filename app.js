//require modules
const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const { DateTime } = require("luxon");
const mainRoutes = require("./routes/mainRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const session = require("express-session");

//create app
const app = express();

//configure app
let port = 3000;
let host = "localhost";
let url = "";
app.set("view engine", "ejs");

//connect to database
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //start app
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

//mount middlware
app.use(
  session({
    secret: "ajfeirf90aeu9eroejfoefj",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: "mongodb://127.0.0.1:27017/demos" }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(flash());

app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

//mount middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));

//Route modules
app.use("/", mainRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);

//404 route not found error handler
app.use((req, res, next) => {
  let err = new Error("The server cannot locate resource at " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render("error", { error: err });
});
