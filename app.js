"use strict";
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoute = require("./back/routes/productRoute");
const userRoute = require("./back/routes/userRoute");
const authRoute = require("./back/routes/authRoute");
const passport = require("./back/utils/pass");
const { httpError } = require("./back/utils/errors");

const app = express();
app.use(cors());

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  require('./back/utils/production')(app, process.env.PORT, process.env.HTTPS_PORT);
} else {
  require('./back/utils/localhost')(app, process.env.PORT);
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static("./uploads/"));
app.use("/thumbnails", express.static("thumbnails"));

app.use(passport.initialize());


app.use("/auth", authRoute);
app.use("/product", productRoute);
app.use("/user", passport.authenticate("jwt", { session: false }), userRoute);

app.use((req, res, next) => {
  const err = httpError("Not found", 404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "internal server error",
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));