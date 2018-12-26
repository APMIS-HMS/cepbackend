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

    find(params) {
        return Promise.resolve(params);
    }

    get(data, params) {
        return Promise.resolve(data);
    }

    async create(data, params) {
        const _inventoryService = this.app.service('inventories');
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
            const userRole = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (userRole.length > 0) {
                try {
                    const getPrescription = await _prescriptionService.get(prescriptionId);
                    if (getPrescription._id) {
                        try {
                            // Dispense from inventory first before updating prescription
                            const getInventory = await _inventoryService.get(inventoryId);
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
                                            referenceService: 'Prescription/Dispense Service', // Dispense, // Transfer...
                                            inventorytransactionTypeId: inventoryTransactionTypeId,
                                        };
                                        inventory.batchTransactions.push(batchTransaction);
                                        inventory.quantity = inventory.quantity - qty;
                                        inventory.availableQuantity = inventory.availableQuantity - qty;
                                    }
                                });
                                getInventory.totalQuantity = getInventory.totalQuantity - qty;
                                getInventory.availableQuantity = getInventory.totalQuantity - qty;

                                try {
                                    // Dispense the required quantity from inventory.
                                    const patchInventory = await _inventoryService.patch(getInventory._id, getInventory, {});

                                    if (patchInventory._id) {
                                        // Update prescription
                                        getPrescription.prescriptionItems.forEach(prescription => {
                                            if (prescription._id.toString() === prescriptionItem._id) {
                                                prescription.dispensed = prescriptionItem.dispensed;
                                                prescription.quantityDispensed += qty;

                                                if (prescription.quantityDispensed === prescription.quantity) {
                                                    prescription.isDispensed = true;
                                                }
                                            }
                                        });

                                        try {
                                            const patchPrescription = await _prescriptionService.patch(getPrescription._id, getPrescription, {});
                                            if (patchPrescription._id) {
                                                return jsend.success(patchPrescription);
                                            }
                                        } catch (e) {
                                            return jsend.error('There was problem trying to updating prescription.');
                                        }
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
                    } else {
                        return jsend.error('There was problem getting prescription.');
                    }
                } catch (e) {
                    return jsend.error('There was problem getting prescription.');
                }
            } else {
                return jsend.error('You have not been assigned to this facility.');
            }
        } else {
            return jsend.error('You are not allowed to perform this transaction.');
        }
    }

    async update(id, data, params) {
        const _prescriptionService = this.app.service('prescriptions');
        const _dispenseService = this.app.service('dispenses');
        const facilityId = data.facilityId;
        const prescriptionId = id;
        const accessToken = params.accessToken;

        if (accessToken !== undefined) {
            const userRole = params.user.facilitiesRole.filter(x => x.facilityId.toString() === facilityId);
            if (userRole.length > 0) {
                try {
                    const getPrescription = await _prescriptionService.get(prescriptionId);
                    if (getPrescription._id) {
                        // Update isDispensed to true;
                        getPrescription.isDispensed = true;
                        try {
                            const patchPrescription = await _prescriptionService.patch(getPrescription._id, getPrescription, {});
                            if (patchPrescription._id) {
                                try {
                                    // create dispense resource.
                                    const createDispense = await _dispenseService.create(data);
                                    if (createDispense._id) {
                                        return jsend.success(createDispense);
                                    }
                                } catch (e) {
                                    return jsend.error('There was problem trying to create dispense.');
                                }
                            }
                        } catch (e) {
                            return jsend.error('There was problem trying to updating prescription.');
                        }
                    } else {
                        return jsend.error('There was problem getting prescription.');
                    }
                } catch (e) {
                    return jsend.error('There was problem getting prescription.');
                }
            } else {
                return jsend.error('You have not been assigned to this facility.');
            }
        } else {
            return jsend.error('You are not allowed to perform this transaction.');
        }

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