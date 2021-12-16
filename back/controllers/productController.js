"use strict";
const { validationResult } = require("express-validator");
// productController
const {
  getAllProducts,
  getProduct,
  addProduct,
  deleteProduct,
  modifyProduct,
  getAllCategories,
  getProductCategory,
} = require("../models/productModel");
const { httpError } = require("../utils/errors");
const { makeThumbnail } = require("../utils/resize");

const product_list_get = async (req, res, next) => {
  try {
    const products = await getAllProducts(next);
    if (products.length > 0) {
      res.json(products);
    } else {
      next("No products found", 404);
    }
  } catch (e) {
    console.log("product_list_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const product_category_get = async (req, res, next) => {
  try {
    const products = await getProductCategory(next, req.params.cat_id);
    if (products.length > 0) {
      res.json(products);
    } else {
      next("No products found", 404);
    }
  } catch (e) {
    console.log("product_category_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const product_get = async (req, res, next) => {
  try {
    const answer = await getProduct(req.params.id, next);
    if (answer.length > 0) {
      res.json(answer.pop());
    } else {
      next(httpError("No product found", 404));
    }
  } catch (e) {
    console.log("product_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

const product_post = async (req, res, next) => {
  console.log("product_post", req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("product_post validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }

  if (!req.file) {
    const err = httpError("file not valid", 400);
    next(err);
    return;
  }

  try {
    const thumb = await makeThumbnail(
        req.file.path,
        "./thumbnails/" + req.file.filename
    );

    const {price, gps, caption, CategoryName } = req.body;

    const result = await addProduct(
        caption,
        req.user.user_id,
        CategoryName,
        req.file.filename,
        price,
        gps,
        next
    );
    if (thumb) {
      if (result.affectedRows > 0) {
        res.json({
          message: "product added",
          product_id: result.insertId,
        });
      } else {
        next(httpError("No product inserted", 400));
      }
    }
  } catch (e) {
    console.log("product_post error", e.message);
    next(httpError("internal server error", 500));
  }
};

const product_put = async (req, res, next) => {
  console.log("product_put", req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("product_put validation", errors.array());
    next(httpError("invalid data", 400));
    return;
  }
  // pvm VVVV-KK-PP esim 2010-05-28
  try {
    const { caption, } = req.body;
    /*let owner = req.user.user_id;
    if (req.user.Role === 0) {
      owner = req.body.owner;
    }*/

    const ProductOwner = req.user.role === 0 ? req.body.owner : req.user.user_id;

    const result = await modifyProduct(
        caption,
        owner,
        req.params.image_location,
        req.user.role,
        next
    );
    if (result.affectedRows > 0) {
      res.json({
        message: "product modified",
        ProductId: result.insertId,
      });
    } else {
      next(httpError("No products modified", 400));
    }
  } catch (e) {
    console.log("product_put error", e.message);
    next(httpError("internal server error", 500));
  }
};

const product_delete = async (req, res, next) => {
  console.log(req.user);
  try {
    const answer = await deleteProduct(
        req.params.id,
        req.user.user_id,
        req.user.role,
        next
    );
    if (answer.affectedRows > 0) {
      res.json({
        message: "product deleted",
        ProductId: answer.insertId,
      });
    } else {
      next(httpError("No product found", 404));
    }
  } catch (e) {
    console.log("product_delete error", e.message);
    next(httpError("internal server error", 500));
  }
};
const category_get = async(req, res, next)=>{
  try {
    const categories = await getAllCategories(next);
    if (categories.length > 0) {
      res.json(categories);
    } else {
      next("No categories found", 404);
    }
  } catch (e) {
    console.log("category_get error", e.message);
    next(httpError("internal server error", 500));
  }
};

module.exports = {
  product_list_get,
  product_get,
  product_post,
  product_delete,
  product_put,
  category_get,
  product_category_get,
};