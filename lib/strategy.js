var jwt = require('jsonwebtoken');
var OAuth2Strategy = require("passport-oauth2");
var InternalOAuthError = OAuth2Strategy.InternalOAuthError;


class Strategy extends OAuth2Strategy {
  constructor(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || "https://id.twitch.tv/oauth2/authorize";
    options.tokenURL = options.tokenURL || "https://id.twitch.tv/oauth2/token";

    super(options, verify);

    this.name = "twitch.tv";
    this.pem = options.pem;

    this._oauth2.setAuthMethod("Bearer");
    this._oauth2.useAuthorizationHeaderforGET(true);
  }
  userProfile(token, done) {
    this._oauth2.get("https://api.twitch.tv/helix/users", token, function (err, body, res) {
      if (err) {
        return done(new InternalOAuthError("failed to fetch user profile", err));
      }
      try {
        done(null, {
          ...JSON.parse(body).data[0],
          provider: 'twitch.js'
        });
      } catch(e) {
        done(e);
      }
    });
  }
  authorizationParams(options) {
    var params = {}
    if (options.forceVerify != undefined) {
      params.force_verify = !!options.forceVerify;
    }
    if (options.scope instanceof Array) {
      params.scope = options.scope.join(" ");
    }
    if (options.scope instanceof String) {
      params.scope = options.scope;
    }
    return params
  }
}

module.exports = Strategy;
