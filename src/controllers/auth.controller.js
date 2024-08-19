'use strict';

const AuthService = require('../services/auth.service');

class AuthController {
  async signUp(req, res, next) {
    return res.status(201).json({
      status: 'success',
      data: await AuthService.signUp(req.body),
    });
  }
}

module.exports = new AuthController();
