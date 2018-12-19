/* eslint-disable no-unused-vars */
const errors = require('@feathersjs/errors');
const generalError = new errors.GeneralError(new Error('Internal server error'));

class Service {
    constructor(options) {
        this.options = options || {};
    }

    setup(app) {
        this.app = app;
    }

    async find(params) {
        const invoiceService = this.app.service('invoices');
        
        let facilityId = params.query.facilityId;
        let getPayments, serviceCategories;

        let date = new Date();
        let startDate = params.query.startDate?params.query.startDate:new Date(date.setHours(0,0,0,0));
        let endDate = params.query.endDate?params.query.endDate:Date.now();
        
        try {
            getPayments = await invoiceService.find({
                query: {
                    facilityId: facilityId,
                    // $and: [{
                    //     createdAt: {
                    //         $gte: startDate
                    //     }
                    // },
                    // {
                    //     createdAt: {
                    //         $lte: endDate // Today's date
                    //     }
                    // }
                    // ],
                    $limit: (params.query.$limit) ? params.query.$limit : 10,
                    $skip: (params.query.$skip) ? params.query.$skip : 0
                }
            });
            /** Get and filter all payments */
            if (getPayments.data.length > 0) {
                /** Get categories */
                let res = [];
                let category = getPayments.data.map(x => {

                    x.payments.map(y => {
                        res.push(y.facilityServiceObject.category);
                    });
                    return res;
                })[0];

                /**Get services and category */
                category = [... new Set(category.map(x => x))];
                
                serviceCategories = getPayments.data.map(x => {
                    let catPrice = {};
                    catPrice.totalPrice = 0;
                    x.payments.map(y => {

                        let cat = y.facilityServiceObject.category;
                        category.map(z => {
                            
                            if (z === cat) {
                                
                                catPrice.category = z;
                                catPrice.totalPrice += y.totalPrice;
                            }

                        });
                    });
                    
                    return catPrice;
                });

                /** Category and amount summary*/
                let resp = category.map(nk => {
                    let categoryItem = {};
                    categoryItem.totalPrice = 0;
                    categoryItem.categoryName = nk;
                    
                    serviceCategories.map(x => {

                        if (x.category === nk) {
                            categoryItem.totalPrice = categoryItem.totalPrice + x.totalPrice;
                        }
                    });
                    return categoryItem;
                });
                getPayments.data = resp;
                getPayments.total = resp.length;
                
                return getPayments;
            }
            else {
                const notFound = new errors.NotFound('No record found for this facility');
                return notFound;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async get(id, params) {
        const invoiceService = this.app.service('invoices');
        
        let facilityId = params.query.facilityId;
        let getPayments, serviceCategories;

        let date = new Date();
        let startDate = params.query.startDate?params.query.startDate:new Date(date.setHours(0,0,0,0));
        let endDate = params.query.endDate?params.query.endDate:Date.now();

        try {
            getPayments = await invoiceService.find({
                query: {
                    facilityId: facilityId,
                    // $and: [{
                    //     createdAt: {
                    //         $gte: startDate
                    //     }
                    // },
                    // {
                    //     createdAt: {
                    //         $lte: endDate
                    //     }
                    // }
                    // ],
                    $limit: (params.query.$limit) ? params.query.$limit : 10,
                    $skip: (params.query.$skip) ? params.query.$skip : 0
                }
            });

            if (getPayments.data.length > 0) {
                /** Get categories */
                let res = [];
                let category = getPayments.data.map(x => {

                    x.payments.map(y => {
                        res.push(y.facilityServiceObject.category);
                    });
                    return res;
                })[0];

                /** Filter category array to get distinct categories */
                category = [... new Set(category.map(x => x))];
                let categoryDetail, result =[];
                serviceCategories = getPayments.data.map(x => { 
                    x.payments.map(y => {
                        let cat = y.facilityServiceObject.categoryId;
                        if(cat.toString()===id.toString()){
                            categoryDetail = {};
                            let person = x.patientObject.personDetails;
                            let patient = person.title+' '+person.firstName+' '+person.lastName+' ';
                            categoryDetail.patient = patient;
                            categoryDetail.category = y.facilityServiceObject.category;
                            categoryDetail.service = y.facilityServiceObject.service;
                            categoryDetail.amountPaid = y.totalPrice;
                            categoryDetail.paymentDate = y.paymentDate;
                            result.push(categoryDetail) ;
                        }
                        
                    });
                });
                getPayments.data = result;
                getPayments.total = result.length;
                return getPayments;
            }else{
                const notFound = new errors.NotFound('No record found for this facility');
                return notFound;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
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
        return Promise.resolve({ id });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
