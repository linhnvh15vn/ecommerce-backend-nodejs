'use strict';

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const selectFields = (fields = []) => {
  return Object.fromEntries(fields.map((field) => [field, 1]));
};

const excludeFields = (fields = []) => {
  return Object.fromEntries(fields.map((field) => [field, 0]));
};

module.exports = {
  catchAsync,
  selectFields,
  excludeFields,
};
