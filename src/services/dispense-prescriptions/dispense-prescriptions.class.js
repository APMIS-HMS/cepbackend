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
        console.log(data);
        console.log(params);
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
                                            if (prescription._id.toString() === prescriptionItem._id) {
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

    update(id, data, params) {
        console.log(id);
        console.log(data);
        console.log(params);
        const _inventoryService = this.app.service('inventories');
        const _prescriptionService = this.app.service('prescriptions');
        const facilityId = data.facilityId;
        const prescriptionId = data.prescriptionId;
        const accessToken = params.accessToken;

        if (accessToken !== undefined) {
            const userRole = params.user.facilitiesRole.filter(x => x.facilityId === facilityId);
            if (userRole.length > 0) {
                // try {
                //     const getPrescription = await _prescriptionService.get(prescriptionId);
                //     console.log('Get Prescription => ', getPrescription);
                //     if (getPrescription._id) {

                //     } else {
                //         return jsend.error('There was problem getting prescription.');
                //     }
                // } catch (e) {
                //     console.log(e);
                //     return jsend.error('There was problem getting prescription.');
                // }
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