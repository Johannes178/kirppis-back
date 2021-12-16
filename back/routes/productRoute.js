"use strict";
// productRoute
const express = require("express");
const { body } = require("express-validator");
const passport = require("../utils/pass");
const multer = require("multer");
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: "./uploads/", fileFilter });
const {
  product_list_get,
  product_get,
  product_post,
  product_put,
  product_delete,
  category_get, product_category_get,
} = require("../controllers/productController");
const router = express.Router();

router.route("/").get(product_list_get).post(
    passport.authenticate("jwt", { session: false }),
    upload.single("product"),
    body("price").isNumeric().escape(),
    body("gps").notEmpty().escape(),
    body("caption").notEmpty().escape(),
    body("CategoryName").notEmpty().escape(),
    product_post
);
router.route("/category").get(category_get);

router.route('/search/:cat_id').get(product_category_get);

router
.route("/:id")
.get(product_get)
.delete(product_delete)
.put(
    body("caption").notEmpty().escape(),
    body("gps").notEmpty().escape(),
    body("category_name").notEmpty().escape(),
    body("price").isNumeric(),
    product_put
);


module.exports = router;