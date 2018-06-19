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
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({ id, text: `A new message with ID: ${id}!` });
    }

    // If this is the first item that is been billed in prescription.
    async create(data, params) {
        console.log('Data => ', data);
        console.log('Params => ', params);
        const prescriptionService = this.app.service('prescriptions');
        const patientService = this.app.service('patients');
        const billCreatorService = this.app.service('bill-creators');
        const accessToken = params.accessToken;
        const facilityId = data.facilityId;
        const billItems = data.billItems;
        const patientId = data.prescription.patientId;
        const prescription = data.prescription;


        if (accessToken !== undefined) {
            const userRole = params.user.facilitiesRole.filter(
                x => x.facilityId.toString() === facilityId);
            if (userRole.length > 0) {
                const patientDetails = await patientService.get(prescription.patientId);
                const patientDefaultPaymentPlan =
                    patientDetails.paymentPlan.find(x => x.isDefault);
                console.log('patientDefaultPaymentPlan => ', patientDefaultPaymentPlan);

                let covered = {};
                if (patientDefaultPaymentPlan.planType === 'wallet') {
                    covered = { coverType: patientDefaultPaymentPlan.planType };
                } else if (patientDefaultPaymentPlan.planType === 'insurance') {
                    covered = {
                        coverType: patientDefaultPaymentPlan.planType,
                        hmoId: patientDefaultPaymentPlan.planDetails.hmoId
                    };
                } else if (patientDefaultPaymentPlan.planType === 'company') {
                    covered = {
                        coverType: patientDefaultPaymentPlan.planType,
                        companyId: patientDefaultPaymentPlan.planDetails.companyId
                    };
                } else if (patientDefaultPaymentPlan.planType === 'family') {
                    covered = {
                        coverType: patientDefaultPaymentPlan.planType,
                        familyId: patientDefaultPaymentPlan.planDetails.familyId
                    };
                }
                billItems.forEach(element => {
                    element.covered = covered;
                    element.active = true;
                });

                // console.log('billData => ', billData);

                // Generate new bill for the selected item
                try {
                    // Use the bill creator to generate bills for the items that has been
                    // billed.
                    let createBill = await billCreatorService.create(
                        billItems, { query: { facilityId: facilityId, patientId: patientId } });

                    if (createBill.length > 0) {
                        createBill = createBill[0];
                        // Update prescription items with
                        createBill.billItems.forEach(bill => {
                            prescription.prescriptionItems.forEach(prescribe => {
                                if (bill.serviceId.toString() === prescribe.serviceId) {
                                    // Update prescription items with billingId
                                    prescribe.billItemId = bill._id;
                                    prescribe.billId = createBill._id;
                                }
                            });
                        });
                        // If bill creation succeeds then update prescription
                        try {
                            const updatePrescription = await prescriptionService.patch(prescription._id, prescription, {});
                            if (updatePrescription) {
                                return jsend.success(updatePrescription);
                            }
                        } catch (e) {
                            console.log(e);
                            return jsend.error('There was a problem updating prescription.');
                        }
                    }
                } catch (e) {
                    console.log(e);
                    return jsend.error('There was a problem getting billingId.');
                }
            } else {
                return jsend.error('You have not been assigned to this facility.');
            }
        } else {
            return jsend.error('You need to log in to perform this transaction');
        }
    }

    // If one or more items have been billed in prescription.
    // async update(id, data, params) {
    //     console.log('Data => ', data);
    //     console.log('Params => ', params);
    //     const prescriptionService = this.app.service('prescriptions');
    //     const billingService = this.app.service('billings');
    //     const patientService = this.app.service('patients');
    //     const billCreatorService = this.app.service('bill-creators');
    //     const accessToken = params.accessToken;
    //     const billId = data.billId;
    //     const facilityId = data.facilityId;
    //     const unBilledArray = data.unBilledArray;
    //     const prescriptionId = data.prescription._id;
    //     const prescription = data.prescription;


    //     if (accessToken !== undefined) {
    //         const userRole = params.user.facilitiesRole.filter(x =>
    //         x.facilityId === facilityId); if (userRole.length > 0) {
    //             // Get billing service with billId
    //             try {
    //                 const getBill = await billingService.get(billId);
    //                 console.log('Get Bill service => ', getBill);
    //                 console.log('Get Id => ', !getBill._id);

    //                 if (getBill._id) {
    //                     const containsIsBilled = unBilledArray.filter(x =>
    //                     x.isBilled); console.log('containsIsBilled => ',
    //                     containsIsBilled);

    //                     let totalCost = 0;
    //                     let totalQuantity = 0;
    //                     if (containsIsBilled.length > 0) {
    //                         const patientDetails = await
    //                         patientService.get(getBill.patientId); const
    //                         patientDefaultPaymentPlan =
    //                         patientDetails.paymentPlan.find(x => x.isDefault);
    //                         console.log('patientDefaultPaymentPlan => ',
    //                         patientDefaultPaymentPlan);

    //                         let covered = {};
    //                         if (patientDefaultPaymentPlan.planType ===
    //                         'wallet') {
    //                             covered = {
    //                                 coverType:
    //                                 patientDefaultPaymentPlan.planType
    //                             };
    //                         } else if (patientDefaultPaymentPlan.planType ===
    //                         'insurance') {
    //                             covered = {
    //                                 coverType:
    //                                 patientDefaultPaymentPlan.planType, hmoId:
    //                                 patientDefaultPaymentPlan.planDetails.hmoId
    //                             };
    //                         } else if (patientDefaultPaymentPlan.planType ===
    //                         'company') {
    //                             covered = {
    //                                 coverType:
    //                                 patientDefaultPaymentPlan.planType,
    //                                 companyId:
    //                                 patientDefaultPaymentPlan.planDetails.companyId
    //                             };
    //                         } else if (patientDefaultPaymentPlan.planType ===
    //                         'family') {
    //                             covered = {
    //                                 coverType:
    //                                 patientDefaultPaymentPlan.planType,
    //                                 familyId:
    //                                 patientDefaultPaymentPlan.planDetails.familyId
    //                             };
    //                         }

    //                         unBilledArray.forEach(element => {
    //                             console.log(element);
    //                             if (element.isBilled) {
    //                                 const billItem = {
    //                                     facilityServiceId:
    //                                     element.facilityServiceId, serviceId:
    //                                     element.serviceId, facilityId:
    //                                     facilityId, patientId:
    //                                     getBill.patientId, description:
    //                                     element.genericName, quantity:
    //                                     element.quantity, totalPrice:
    //                                     element.totalCost, unitPrice:
    //                                     element.cost, unitDiscountedAmount: 0,
    //                                     totalDiscoutedAmount: 0,
    //                                     covered: covered,
    //                                     active: true
    //                                 };

    //                                 totalCost += element.totalCost;
    //                                 totalQuantity += element.quantity;

    //                                 getBill.billItems.push(billItem);
    //                             }
    //                         });

    //                         // Update the subTotal and grandTotal in the
    //                         billing response. getBill.subTotal += totalCost;
    //                         getBill.grandTotal += totalCost;
    //                         try {
    //                             // Update the Billing service
    //                             const patchBill = await
    //                             billingService.patch(getBill._id, getBill, {});
    //                             console.log('PatchBll => ', patchBill);
    //                             if (patchBill._id) {
    //                                 try {
    //                                     const updatePrescription = await
    //                                     prescriptionService.patch(prescription._id,
    //                                     prescription, {});
    //                                     console.log('updatePrescription => ',
    //                                     updatePrescription);

    //                                     if (updatePrescription._id) {
    //                                         return
    //                                         jsend.success(updatePrescription);
    //                                     }
    //                                 } catch (e) {
    //                                     console.log(e);
    //                                     return jsend.error('There was a problem
    //                                     updating prescription service.');
    //                                 }
    //                             }
    //                         } catch (e) {
    //                             console.log(e);
    //                             return jsend.error('There was a problem
    //                             updating billing service.');
    //                         }
    //                     } else {

    //                     }
    //                 } else {

    //                 }
    //             } catch (e) {
    //                 console.log(e);
    //                 return jsend.error('There was a problem getting
    //                 billingId.');
    //             }
    //         } else {
    //             return jsend.error('You have not been assigned to this
    //             facility.');
    //         }
    //     } else {
    //         return jsend.error('You need to log in to perform this
    //         transaction');
    //     }

    // }

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