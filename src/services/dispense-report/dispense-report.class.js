/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }
    setup(app){
        this.app = app;
    }

    async find (params) {
        const InventoryService = this.app.service('inventories');
        const PrescriptionService = this.app.service('prescriptions');

        let dispense = {
            patientName:String, 
            product:String, 
            batch:String, 
            qty:String, 
            unitPrice:String, 
            totalPrice:String,
            userName:String
        };
        let getPrescription;
        let date = new Date();
        let startDate = params.query.startDate?params.query.startDate: new Date(date.setHours(0,0,0,0));
        let endDate = params.query.endDate?params.query.endDate: new Date(date.setHours(0,0,0,0));
        
        try {
            let facilityId = params.query.facilityId;
            // let getInventory = await InventoryService.find({query:{facilityId:facilityId}});
            if(startDate === undefined && endDate === undefined){
                console.log('Got here 1');
                getPrescription = await PrescriptionService.find({
                    query:{
                        facilityId:facilityId,
                        $and: [{
                            createdAt: {
                                $gte: startDate
                            }
                        },
                        {
                            createdAt: {
                                $lte: endDate // endDate = startDate minus 7 days
                            }
                        }
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$skip)?params.query.$skip:0
                    }
                });
            }else if(params.query.personId !== undefined){
                console.log('Got here 2');
                getPrescription = await PrescriptionService.find({
                    query:{
                        facilityId:facilityId,
                        personId:params.query.personId,
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$skip)?params.query.$skip:0
                    }
                });
            }else{
                console.log('Got here 3');
                getPrescription = await PrescriptionService.find({
                    query:{
                        facilityId:facilityId,
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$skip)?params.query.$skip:0
                    }
                });
            }
           
            let dispenseDetail;
            if(getPrescription.data.length !== 0){
                let data = getPrescription.data;
                dispenseDetail = data.map(x=>{

                    dispense.patientName= x.personDetails.title+' '+x.personDetails.firstName+' '+x.personDetails.lastName;
                    dispense.userName= x.personDetails.title+' '+x.personDetails.firstName+' '+x.personDetails.lastName;
                    if(x.prescriptionItems !== undefined && x.prescriptionItems.length>0){
                        x.prescriptionItems.map(y=>{
                            console.log('Got here',y);
                            dispense.product= y.genericName;
                            dispense.batch= y.code;
                            dispense.qty= y.quantity;
                            dispense.unitPrice= y.cost;
                            dispense.totalPrice= y.totalCost;
                        });
                        
                    }
                   
                    return {
                        dispense
                    };
                });
            }

            getPrescription.data = dispenseDetail;
            
            return jsend.success(getPrescription);
        } catch (error) {
            console.log(error);
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
