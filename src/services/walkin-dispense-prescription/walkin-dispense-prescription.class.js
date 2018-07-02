'use strict';
/* eslint-disable no-unused-vars */
const jsend = require('jsend');

class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    setup(app) {
        this.app = app;
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const _inventoryService = this.app.service('inventories');
        const _dispenseService = this.app.service('dispenses');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const inventoryTransactionTypeId = data.inventoryTransactionTypeId;
        const drugs = data.nonPrescription.drugs;

        if (accessToken !== undefined) {
            const userRole = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (userRole.length > 0) {
                if (drugs.length > 0) {
                    for (let i = 0; i < drugs.length; i++) {
                        const drug = drugs[i];

                        try {
                            // Dispense from inventory first before updating prescription
                            const getInventory = await _inventoryService.get(drug.inventoryId);

                            if (getInventory._id) {
                                getInventory.transactions.forEach(inventory => {
                                    if (inventory._id.toString() === drug.batchNumberId) {
                                        const batchTransaction = {
                                            batchNumber: drug.batchNumber,
                                            employeeId: drug.employeeId,
                                            preQuantity: inventory.quantity, // Before Operation.
                                            postQuantity: inventory.quantity - drug.quantity, // After Operation.
                                            quantity: drug.quantity, // Operational qty.
                                            referenceId: drug.referenceId, // Dispense id, Transfer id...
                                            referenceService: drug.referenceService, // Dispense, // Transfer...
                                            inventorytransactionTypeId: inventoryTransactionTypeId
                                        };
                                        inventory.batchTransactions.push(batchTransaction);
                                        inventory.quantity = inventory.quantity - drug.quantity;
                                        inventory.availableQuantity = inventory.availableQuantity - drug.quantity;
                                    }
                                });
                                getInventory.totalQuantity = getInventory.totalQuantity - drug.quantity;
                                getInventory.availableQuantity = getInventory.totalQuantity - drug.quantity;

                                try {
                                    // Dispense the required quantity from inventory.
                                    const patchInventory = await _inventoryService.patch(getInventory._id, getInventory, {});
                                    if (patchInventory._id !== undefined) {
                                        // Done.
                                    }
                                } catch (e) {
                                    return jsend.error('There was problem trying to dispense from inventory.');
                                }
                            } else {
                                return jsend.error('There was problem getting inventory.');
                            }
                        } catch (e) {
                            return jsend.error('There was problem getting inventory.');
                        }
                    }

                    try {
                        const patchPrescription = await _dispenseService.create(data);
                        if (patchPrescription._id) {
                            return jsend.success(patchPrescription);
                        }
                    } catch (e) {
                        return jsend.error('There was problem trying to updating prescription.');
                    }
                } else {
                    return jsend.error('Please add items to dispense.');
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