// const hbs = require("hbs");

// hbs.registerHelper("formatDate", function (date) {
//   return new Date(date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
// });

// module.exports = hbs;

// utils/helpers.js
const hbs = require("hbs");

hbs.registerHelper("formatDate", function (date) {
  return new Date(date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
});

module.exports = hbs;