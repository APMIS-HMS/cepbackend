const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const purchaseOrderId = require('../../hooks/purchase-order-id');
const { fastJoin } = require('feathers-hooks-common');

const resolvers = {
    joins: {
        facilityDetails: () => async(data, context) => {
            const supplier = await context.app.service('suppliers').get(data.supplierId);
            data.supplierObject = supplier;
        },
        storeDetails: () => async(data, context) => {
            const store = await context.app.service('stores').get(data.storeId);
            data.storeObject = store;
        },
        productObject: () => async(data, context) => {
            if (data.orderedProducts !== null && data.orderedProducts !== undefined) {
                if (data.orderedProducts.length > 0) {
                    let len2 = data.orderedProducts.length - 1;
                    for (let j = 0; j <= len2; j++) {
                        if (data.orderedProducts[j] !== undefined) {
                            try {
                                const productConfig = await context.app.service('product-configs').find({
                                    query: {
                                        facilityId: data.facilityId,
                                        productId: data.orderedProducts[j].productId
                                    }
                                });
                                if (productConfig.data.length > 0) {
                                    data.orderedProducts[j].productObject.productConfigObject = productConfig.data[0].packSizes;
                                }else{
                                    data.orderedProducts[j].productObject.productConfigObject = {};
                                }
                                
                            } catch (e) {
                                // console.log(e);
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [purchaseOrderId()],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [fastJoin(resolvers)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};