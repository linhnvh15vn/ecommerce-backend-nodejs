'use strict';

const { StatusCodes, ReasonPhrases } = require('../core/http/http-status-code');

class SuccessResponse {
  /**
   *
   */
  constructor({
    message = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    data = {},
  }) {
    this.status = 'success';
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class Ok extends SuccessResponse {
  /**
   *
   */
  constructor(message, statusCode, data) {
    super(message, statusCode, data);
  }
}

class Created extends SuccessResponse {
  /**
   *
   */
  constructor({
    message = ReasonPhrases.CREATED,
    statusCode = StatusCodes.CREATED,
    data,
  }) {
    super({ message, statusCode, data });
  }
}

module.exports = {
  Ok,
  Created,
};
