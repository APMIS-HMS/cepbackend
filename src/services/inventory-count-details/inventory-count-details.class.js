/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        const inventoryService = this.app.service('inventories');
        let inventoryProducts = await inventoryService.find({
            query: {
                storeId: params.query.storeId,
                facilityId: params.query.facilityId,
                availableQuantity: {
                    $gt: 0
                },
                $limit: false
            }
        });
        const retValue = inventoryProducts.data.map(x => {
            return {
                batches: x.transactions.map(u => {
                    return {
                        batchNumber: u.batchNumber,
                        quantity: u.quantity
                    };
                }),
                productName: x.productObject.name,
            };
        });
        return jsend.success(retValue);
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    create(data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current, params)));
        }

        return Promise.resolve(data);
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({
            id
        });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;