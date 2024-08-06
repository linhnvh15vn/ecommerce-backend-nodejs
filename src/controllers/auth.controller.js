'use strict';

const AuthService = require('../services/auth.service');

class AuthController {
  async signUp(req, res, next) {
    return {
      data: await AuthService.signUp(req.body),
    };
  }
}

module.exports = new AuthController();
