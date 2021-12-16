'use strict';
const { validationResult } = require('express-validator');
const { getAllUsers, getUser, addUser, modifyUser} = require('../models/userModel');
const { httpError } = require('../utils/errors');

const user_list_get = async (req, res, next) => {
  try {
    const users = await getAllUsers(next);
    if (users.length > 0) {
      res.json(users);
    } else {
      next('No users found', 404);
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const answer = await getUser(req.params.id, next);
    if (answer.length > 0) {
      res.json(answer.pop());
    } else {
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_modify = async (req, res) => {
  const updated = await modifyUser(req.body);
  res.json({message: `User updated ${updated}`});
    }


const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};


module.exports = {
  user_list_get,
  user_get,
  user_modify,
  checkToken,
};
