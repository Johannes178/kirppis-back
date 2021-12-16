'use strict';
// userRoute
const express = require('express');
const multer = require("multer");
const { body } = require('express-validator');
const upload = multer({ dest: './uploads/'});
const {
  user_list_get,
  user_get,
  user_post,
  checkToken,
} = require('../controllers/userController');
const router = express.Router();

router.get('/token', checkToken);

router.get('/', user_list_get);

router.get('/:id', user_get);

router.put('/', (req, res) => {
  res.send('From this endpoint you can modify users.');
});

router.delete('/', (req, res) => {
  res.send('From this endpoint you can delete users.');
});

module.exports = router;