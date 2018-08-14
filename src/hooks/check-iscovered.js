// Use this context to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return context => {
      if (context.type === "before") {
        context.params.isCoveredPage = context.params.query.isCoveredPage;
        delete context.params.query.isCoveredPage;
      } 
      return Promise.resolve(context);
    };
  };
  