// Use ES6
"use strict";
const _ = require("lodash");

class User {
  constructor(options) {
    _.assign(this, options);
  }
}

module.exports = User;