"use strict";
const pool = require("../database/db");
const { httpError } = require("../utils/errors");
const promisePool = pool.promise();

const getAllProducts = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
        SELECT * FROM Product 
        JOIN Category ON Category.category_id  =  Product.category_id                        
        JOIN User ON User.user_id = Product.user_id;`
    );
    return rows;
  } catch (e) {
    console.error("getAllProducts error", e.message);
    next(httpError("Database error", 500));
  }
};


const getProductCategory = async (next, category_id) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
        SELECT * FROM Product 
        JOIN Category ON Category.category_id  =  Product.category_id                        
        JOIN User ON User.user_id = Product.user_id WHERE Category.category_id = ?;`, [category_id]
    );
    return rows;
  } catch (e) {
    console.error("getAllProducts error", e.message);
    next(httpError("Database error", 500));
  }
};


const getProductsByKeyword = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute(`
	SELECT 
  CategoryName, 
	FROM Category`);
    return rows;
  } catch (e) {
    console.error("getProductsByKeyword error", e.message);
    next(httpError("Database error", 500));
  }
};

const getProduct = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
        `
	  SELECT *
	  FROM Product
	  JOIN Category ON 
	  Product.category_id = Category.category_id
	  WHERE Category.category_id = ?`,
        [id]
    );
    return rows;
  } catch (e) {
    console.error("getProduct error", e.message);
    next(httpError("Database error", 500));
  }
};

const addProduct = async (
    Caption,
    user_id,
    category_id,
    image_location,
    price,
    gps,
    next
) => {
  try {
    const [rows] = await promisePool.execute(
        "INSERT INTO Product (Caption, category_id, user_id, image_location, price, gps) VALUES (?, ?, ?, ?, ?, ?)",
        [Caption, category_id, user_id, image_location, price, gps],
    );
    return rows;
  } catch (e) {
    console.error("addProduct error", e.message);
    next(httpError("Database error", 500));
  }
};

const modifyProduct = async (
    owner,
    caption,
    gps,
    price,
    role,
    next
) => {
  let sql =
      "UPDATE Product SET caption = ?, gps = ?, price = ? WHERE Product = ? AND owner = ?;";
  let params = [ caption, gps, price, owner, role];
  if (role === 0) {
    sql =
        "UPDATE Product SET caption = ?, gps = ?, price = ? WHERE Product = ?;";
    params = [caption, gps, price];
  }
  console.log("sql", sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("addProduct error", e.message);
    next(httpError("Database error", 500));
  }
};

const deleteProduct = async (user_id, role, next) => {
  let sql = "DELETE FROM Product WHERE image_location = ? AND user_id = ?;";
  let params = [user_id];
  if (role === 0) {
    sql = "DELETE FROM Product WHERE image_location = ?";
    params = [user_id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error("getProduct error", e.message);
    next(httpError("Database error", 500));
  }
};
const getCategories = async (category_id, next) => {
  try {
    const [rows] = await promisePool.execute(
        "SELECT * FROM Category where category_id=?",
        [category_id]
    );
    return rows;
  } catch (e) {
    console.error("getCategory error", e.message);
    next(httpError("Database error", 500));
  }
};
const getCategory = async (category_name, next) => {
  try {
    const [rows] = await promisePool.execute(
        "SELECT category_name FROM Category where category_id=?",
        [category_name]
    );
    return rows;
  } catch (e) {
    console.error("getCategory error", e.message);
    next(httpError("Database error", 500));
  }
};

const getAllCategories = async ( next) => {
  try {
    const [rows] = await promisePool.execute(
        "SELECT * FROM Category"
    );
    return rows;
  } catch (e) {
    console.error("getCategory error", e.message);
    next(httpError("Database error", 500));
  }
};
module.exports = {
  getAllProducts,
  getProductsByKeyword,
  getProduct,
  addProduct,
  modifyProduct,
  deleteProduct,
  getCategories,
  getAllCategories,
  getCategory,
  getProductCategory,
};