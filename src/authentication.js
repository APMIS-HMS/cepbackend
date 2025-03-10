const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const {
  fastJoin
} = require('feathers-hooks-common');
var AES = require('crypto-js/aes');
const CircularJSON = require('circular-json');

var CryptoJS = require('crypto-js');
module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local(config.local));

  const resolvers = {
    joins: {
      security: () => async (login, context) => {
        try {
          if (process.env.USE_LOGIN_ENCRYPTION === true) {
            if (login.email !== undefined) {
              var email_bytes = AES.decrypt(CircularJSON.parse(login.email), 'endurance@pays@alot');
              var password_bytes = AES.decrypt(CircularJSON.parse(login.password), 'endurance@pays@alot');
              login.email = email_bytes.toString(CryptoJS.enc.Utf8);
              login.password = password_bytes.toString(CryptoJS.enc.Utf8);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };


  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        fastJoin(resolvers),
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [authentication.hooks.authenticate('jwt')]
    },
    after: {
      create: [context => {
        context.result.user = context.params.user;
        // Don't expose sensitive information.
        delete context.result.user.password;
      }]
    }
  });
};
