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

const cleanObject = (object) => {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([_, value]) => value !== null && value !== undefined,
    ),
  );
};

// TODO fix later
const cleanNestedObject = (obj) => {
  if (obj === null || obj === undefined) {
    return;
  }

  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        // Recursively clean nested objects
        .map(([key, value]) => [key, cleanNestedObject(value)])
        // Filter out null and undefined
        .filter(([_, value]) => value !== null && value !== undefined),
    );
  }

  return obj; // Return the value if it's not an object
};

module.exports = {
  catchAsync,
  selectFields,
  excludeFields,
  cleanObject,
  cleanNestedObject,
};
