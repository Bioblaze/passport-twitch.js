var strategy = require('./strategy');
require('pkginfo')(module, "version");
exports.Strategy = exports.Oauth2Strategy = strategy;
