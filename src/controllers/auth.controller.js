'use strict';

const AuthService = require('../services/auth.service');
const { Created, Ok } = require('../core/success.response');

const signUp = async (req, res, next) => {
  new Created({ data: await AuthService.signUp(req.body) }).send(res);
};

const logIn = async (req, res, next) => {
  new Ok({ data: await AuthService.logIn(req.body) }).send(res);
};

const logOut = async (req, res, next) => {
  new Ok({ data: await AuthService.logOut(req.keyStore) }).send(res);
};

module.exports = {
  signUp,
  logIn,
  logOut,
};
