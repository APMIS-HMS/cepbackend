// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async (context) => {

    const productService = context.app.service('product-reorder');
    let reorderIsh;
    try {
      reorderIsh = await productService.find({
        query: {
          facilityId: context.result.facilityId,
          storeId: context.result.storeId,
          productId: context.result.productId
        }
      })
    } catch (e) {}
    return Promise.resolve(context);
  };
};
