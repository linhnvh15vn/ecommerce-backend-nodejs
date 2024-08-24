'use strict';

const AuthService = require('../services/auth.service');
const { Created, Ok } = require('../core/success.response');

class AuthController {
  async signUp(req, res, next) {
    new Created({ data: await AuthService.signUp(req.body) }).send(res);
  }

  async logIn(req, res, next) {
    new Ok({ data: await AuthService.logIn(req.body) }).send(res);
  }

  async logOut(req, res, next) {
    new Ok({ data: await AuthService.logOut(req.keyStore) }).send(res);
  }
}

module.exports = new AuthController();
