// This wrapper allows CommonJS require() to work naturally
const mod = require("./dist/cjs/index.js");

// If it's an ES module bundle with a default export:
module.exports = mod.default ?? mod;
