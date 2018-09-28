/* eslint-disable no-unused-vars */
var isAfter = require('date-fns/is_after');
var isBefore = require('date-fns/is_before');
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        if (params.query.storeId !== undefined) {
            console.log(params.query.storeId);
            const inventoriesService = this.app.service('inventories');
            let expiredProduct = await inventoriesService.find({
                query: {
                    storeId: params.query.storeId,
                    availableQuantity: {
                        $gt: 0
                    },
                    $limit: false
                }
            });

            return jsend.success(expiredProduct.data.map(x => {
                return {
                    transactions: x.transactions.filter(y => isAfter(y.expiryDate, Date.now())).map(u => {
                        return {
                            quantity: u.quantity,
                            batchNumber: u.batchNumber,
                            expiryDate: u.expiryDate
                        };
                    }),
                    productName: x.productObject.name
                };
            }));
        } else {
            return jsend.error({
                code: 500,
                message: this.app
            });
        }

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