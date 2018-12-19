/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }

    setup(app){
        this.app=app;
    }

    async find (params) {
        const InventoryService = this.app.service('inventories');
        const PrescriptionService = this.app.service('prescriptions');
        const ProductServcie = this.app.service('products');

        let prescription = {
            patientName:String, 
            prescription:String, 
            pharmacy:String, 
            refillStatus:String, 
            dateWritten:String, 
            userName:String
        };
        try {
            let facilityId = params.query.facilityId;
            // let getInventory = await InventoryService.find({query:{facilityId:facilityId}});

            let getPrescription = await PrescriptionService.find({
                query:{
                    facilityId:facilityId
                }});

            let prescriptionData;
            if(getPrescription.data !== undefined){
                prescriptionData = getPrescription.data.map(x=>{
                    //console.log(x);
                    prescription.patientName = x.personDetails.title+' '+x.personDetails.firstName+' '+x.personDetails.lastName;
                    prescription.prescription = x.prescriptionItems.genericName;
                    // prescription.pharmacy = x.pharmacy;
                    prescription.refillStatus = x.refillStatus;
                    prescription.dateWritten = x.createdAt;
                    prescription.userName = x.employeeDetails.title+' '+x.employeeDetails.firstName+' '+x.employeeDetails.lastName;
                    return {
                        prescription
                    };
                });
            }
            return jsend.success(prescriptionData);
        } catch (error) {
            return jsend.error(error);
        }
    }

    get (id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    create (data, params) {
        if (Array.isArray(data)) {
            return Promise.all(data.map(current => this.create(current, params)));
        }

        return Promise.resolve(data);
    }

    update (id, data, params) {
        return Promise.resolve(data);
    }

    patch (id, data, params) {
        return Promise.resolve(data);
    }

    remove (id, params) {
        return Promise.resolve({ id });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
