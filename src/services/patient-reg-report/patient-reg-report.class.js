/* eslint-disable no-unused-vars */
const  jsend = require('jsend');
class Service {
    constructor (options) {
        this.options = options || {};
    }

    setup(app){
        this.app=app;
    }

    async find (params) {
        let PatientService = this.app.service('patients');
        //params.query.$select = ['personDetails'];
        try {
            let getPatients = await PatientService.find({query:params.query});
            if (getPatients.data.length>0){
                let personDetails = getPatients.data.map(x=>{
                    return {
                        APMISId:x.personDetails.apmisId,
                        patientName:x.personDetails.firstName,
                        gender:x.personDetails.gender, 
                        Age:x.age,
                        Address:x.personDetails.homeAddress, 
                        phone:x.personDetails.primaryContactPhoneNo,
                        dateCreated:x.createdAt
                    };
                });
                return jsend.success(personDetails);
            }
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
