module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return context => {
      console.log(context.params);
      return Promise.resolve(context);
    };
  };