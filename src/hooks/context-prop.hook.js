// Use this context to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    if (context.type === "before") {
      if (context.params.query !== undefined) {
        if (context.params.query.setName !== undefined) {
          context.params.setName = context.params.query.setName;
          delete context.params.query.setName;
        }
      }
    }
    return Promise.resolve(context);
  };
};
