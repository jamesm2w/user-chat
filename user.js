// Use ES6
"use strict";
const _ = require("lowdash");

class User {
  constructor(options) {
    _.assign(this, options);
  }
}

module.exports = User;