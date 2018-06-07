'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        // const inventoryService = this.app.service('inventories');
        // const productService = this.app.service('products');
        // const storeService = this.app.service('stores');
        // const facilityPriceService = this.app.service('facility-prices');
        // const facilityId = params.query.facilityId;
        // const ingredients = (params.query.ingredients !== undefined) ?
        // JSON.parse(params.query.ingredients) : undefined; const action =
        // params.query.action; const text = (params.query.text !== undefined) ?
        // params.query.text : undefined; const storeId = (params.query.storeId !==
        // undefined) ? params.query.storeId : undefined;

        // if (facilityId !== undefined) {
        //     if (action === 'genericSearch') {
        //         if (ingredients !== undefined && ingredients.length > 0) {
        //             // Get all the products for the facility.
        //             let products = await productService.find({ query: {
        //             facilityId: facilityId } }); if (products.data.length > 0) {
        //                 products = products.data;
        //                 // Check if the ingredient that was sent is contained in
        //                 any product details. let i = products.length; const
        //                 results = [];

        //                 while (i--) {
        //                     let product = products[i];
        //                     if (product.productDetail.ingredients !== undefined
        //                     && product.productDetail.ingredients.length > 0) {
        //                         for (let j = 0; j < ingredients.length; j++) {
        //                             let ingredient = ingredients[j];
        //                             const compare =
        //                             this.compareIngredient(product.productDetail.ingredients,
        //                             ingredient);

        //                             if (compare) {
        //                                 // Found product that matches the sent
        //                                 ingredient. Then send the product to the
        //                                 client. const inventories = await
        //                                 inventoryService.find({ query: {
        //                                 facilityId: facilityId, productId:
        //                                 product._id } });

        //                                 if (inventories.data.length > 0) {
        //                                     let inventory = inventories.data[0];
        //                                     let resultItem = {};
        //                                     resultItem.productId =
        //                                     inventory.productId;
        //                                     resultItem.product = product.name;
        //                                     resultItem.availability = [];
        //                                     resultItem.totalQuantity = 0;
        //                                     resultItem.serviceId =
        //                                     inventory.serviceId;
        //                                     resultItem.categoryId =
        //                                     inventory.categoryId;
        //                                     resultItem.facilityServiceId =
        //                                     inventory.facilityServiceId;

        //                                     let k = inventories.data.length;
        //                                     while (k--) {
        //                                         let inventoryItem =
        //                                         inventories.data[k]; let item =
        //                                         {}; resultItem.totalQuantity +=
        //                                         inventoryItem.totalQuantity;
        //                                         // Attach store name from stores
        //                                         collection with storeId let store
        //                                         = await
        //                                         storeService.get(inventoryItem.storeId);
        //                                         item.store = store.name;
        //                                         item.storeId =
        //                                         inventoryItem.storeId;
        //                                         item.quantity =
        //                                         inventoryItem.totalQuantity;
        //                                         resultItem.availability.push(item);
        //                                         let prices = await
        //                                         facilityPriceService.find({
        //                                             query: {
        //                                                 facilityId: facilityId,
        //                                                 serviceId:
        //                                                 inventoryItem.serviceId,
        //                                                 facilityServiceId:
        //                                                 inventoryItem.facilityServiceId,
        //                                                 categoryId:
        //                                                 inventoryItem.categoryId
        //                                             }
        //                                         });
        //                                         if (prices.data.length > 0) {
        //                                             let price = prices.data[0];
        //                                             resultItem.price =
        //                                             price.price;
        //                                         } else {
        //                                             resultItem.price = 0;
        //                                         }
        //                                         results.push(resultItem);
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }

        //                 return jsend.success(results);
        //             } else {
        //                 return jsend.error('You do not have any product yet.
        //                 Please create product and bring them into your
        //                 inventory');
        //             }
        //         } else {
        //             return jsend.error('Parameter ingredients is missing or it is
        //             not an array.');
        //         }
        //     } else if (action === 'productSearch') {
        //         let inventories = await inventoryService.find({ query: {
        //         facilityId: facilityId, storeId: storeId } }); const results =
        //         []; if (inventories.data.length > 0) {
        //             inventories = inventories.data;
        //             let i = inventories.length;
        //             while (i--) {
        //                 let inventory = inventories[i];
        //                 const productId = inventory.productId;
        //                 let product = await productService.get(productId);
        //                 if
        //                 (product.name.toLowerCase().includes(text.toLowerCase()))
        //                 {
        //                     const storeId = inventory.storeId;
        //                     inventory.product = product.name;
        //                     let store = await storeService.get(storeId);
        //                     inventory.store = store.name;
        //                     let prices = await facilityPriceService.find({
        //                         query: {
        //                             facilityId: facilityId,
        //                             serviceId: inventory.serviceId,
        //                             facilityServiceId:
        //                             inventory.facilityServiceId, categoryId:
        //                             inventory.categoryId
        //                         }
        //                     });
        //                     if (prices.data.length > 0) {
        //                         let price = prices.data[0];
        //                         inventory.price = price.price;
        //                     } else {
        //                         inventory.price = 0;
        //                     }
        //                     results.push(inventory);
        //                 }

        //             }
        //             return jsend.success(results);
        //         } else {
        //             return jsend.success([]);
        //         }
        //     }
        // } else {
        //     return jsend.error('You are not allowed to perform this
        //     transaction.');
        // }
    }

    get(data, params) {
        return Promise.resolve(data);
    }

    async create(data, params) {
        console.log(data);
        console.log(params);
        const _inventoryService = this.app.service('inventories');
        const _facilityPriceService = this.app.service('facility-prices');
        const _prescriptionService = this.app.service('prescriptions');
        const facilityId = data.facilityId;
        const prescriptionId = data.prescriptionId;
        const inventoryId = data.inventoryId;
        const inventoryTransactionTypeId = data.inventoryTransactionTypeId;
        const batch = data.batch;
        const qty = data.qty;
        const prescriptionItem = data.prescriptionItem;
        const accessToken = params.accessToken;

        if (accessToken !== undefined) {
            const userRole = params.user.facilitiesRole.filter(
                x => x.facilityId.toString() === facilityId);
            if (userRole.length > 0) {
                try {
                    const getPrescription =
                        await _prescriptionService.get(prescriptionId);
                    console.log('Get Prescription => ', getPrescription);
                    if (getPrescription._id) {
                        try {
                            // Dispense from inventory first before updating prescription
                            const getInventory = await _inventoryService.get(inventoryId);
                            console.log('Get Inventory => ', getInventory);
                            if (getInventory._id) {
                                getInventory.transactions.forEach(inventory => {
                                    if (inventory._id.toString() === batch._id) {
                                        const batchTransaction = {
                                            batchNumber: batch.batchNumber,
                                            employeeId: getPrescription.employeeId,
                                            preQuantity: inventory.quantity, // Before Operation.
                                            postQuantity: batch.quantity - qty, // After Operation.
                                            quantity: qty, // Operational qty.
                                            referenceId: prescriptionId, // Dispense id, Transfer id...
                                            referenceService: 'Prescription/Dispense Service', // Dispense,
                                            // Transfer...
                                            inventorytransactionTypeId: inventoryTransactionTypeId,
                                        }
                                        inventory.batchTransactions.push(batchTransaction);
                                        inventory.quantity = inventory.quantity - qty;
                                        inventory.availableQuantity =
                                            inventory.availableQuantity - qty;
                                    }
                                });
                                getInventory.totalQuantity = getInventory.totalQuantity - qty;

                                try {
                                    // Dispense the required quantity from inventory.
                                    const patchInventory = await _inventoryService.patch(
                                        getInventory._id, getInventory, {});
                                    console.log('PatchInventory => ', patchInventory);

                                    if (patchInventory) {
                                        // Update prescription
                                        getPrescription.prescriptionItems.forEach(prescription => {
                                            if (prescription._id.toString() ===
                                                prescriptionItem._id) {
                                                console.log('complete');
                                                prescription.dispensed = prescriptionItem.dispensed;
                                                prescription.quantityDispensed = qty;

                                                if (prescription.quantityDispensed ===
                                                    prescription.quantity) {
                                                    prescription.isDispensed = true;
                                                }
                                            }
                                        });

                                        try {
                                            const patchPrescription =
                                                await _prescriptionService.patch(
                                                    getPrescription._id, getPrescription, {});
                                            console.log('patchPrescription => ', patchPrescription);

                                            if (patchPrescription) {
                                                return jsend.success(patchPrescription);
                                            }
                                        } catch (e) {
                                            console.log(e);
                                            return jsend.error(
                                                'There was problem trying to updating prescription.');
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                    return jsend.error(
                                        'There was problem trying to dispense from inventory.');
                                }
                            } else {
                                return jsend.error('There was problem getting inventory.');
                            }
                        } catch (e) {
                            console.log(e);
                            return jsend.error('There was problem getting inventory.');
                        }
                    } else {
                        return jsend.error('There was problem getting prescription.');
                    }
                } catch (e) {
                    console.log(e);
                    return jsend.error('There was problem getting prescription.');
                }
            } else {
                return jsend.error('You have not been assigned to this facility.');
            }
        } else {
            return jsend.error('You are not allowed to perform this transaction.');
        }
    }

    update(id, data, params) {
        return Promise.resolve(data);
    }

    patch(id, data, params) {
        return Promise.resolve(data);
    }

    remove(id, params) {
        return Promise.resolve({ id });
    }
}

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;