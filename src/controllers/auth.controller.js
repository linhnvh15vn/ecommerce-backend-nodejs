'use strict';

const AuthService = require('../services/auth.service');
const { Created } = require('../core/success.response');

class AuthController {
  async signUp(req, res, next) {
    new Created({ data: await AuthService.signUp(req.body) }).send(res);
  }
}

module.exports = new AuthController();
