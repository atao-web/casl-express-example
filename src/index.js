// Entrypoint for production mode only (ie running with build bundle). Otherwise see server.js
 
// @babel/polyfill is now deprecated in favor of directly including core-js/stable (to polyfill ECMAScript features) 
// and regenerator-runtime/runtime (needed to use transpiled generator functions):
require('core-js/stable');
require('regenerator-runtime/runtime');
 
require('./server');
