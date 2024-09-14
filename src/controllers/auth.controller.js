'use strict';

const AuthService = require('../services/auth.service');
const { Created, Ok } = require('../core/success.response');
const { catchAsync } = require('../utils');

class AuthController {
  signUp = catchAsync(async (req, res, next) => {
    return new Created({
      data: await AuthService.signUp(req.body),
    }).send(res);
  });

  logIn = catchAsync(async (req, res, next) => {
    return new Ok({
      data: await AuthService.logIn(req.body),
    }).send(res);
  });
}

module.exports = new AuthController();
