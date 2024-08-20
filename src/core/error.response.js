'use strict';

const { StatusCodes, ReasonPhrases } = require('../core/http/http-status-code');

class ErrorResponse extends Error {
  /**
   *
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  }
}

class BadRequest extends ErrorResponse {
  /**
   *
   */
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

class Forbidden extends ErrorResponse {
  /**
   *
   */
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}

class NotFound extends ErrorResponse {
  /**
   *
   */
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequest,
  Forbidden,
  NotFound,
};
