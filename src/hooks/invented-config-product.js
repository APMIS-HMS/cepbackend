// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    if (context.params.query.storeId !== undefined) {
      context.mStoreId = context.params.query.storeId;
      delete context.params.query.storeId;
    }
    return Promise.resolve(context);
  };
};
