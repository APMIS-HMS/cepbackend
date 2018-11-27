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
        const DocumentationsService = this.app.service('documentations');
        const PatientService = this.app.service('patients');

        try {
            let getDoc = await DocumentationsService.find({query:{personId:params.query.personId}});
            //return getDoc;
            if(getDoc.data.length>0){
                let documentations = getDoc.data[0].documentations;
                let patientIds = documentations.map(x=>x.patientId);
                let getPatient;
                getPatient = await PatientService.find({query:{'_id': { $in: patientIds }}});

                let summary=[];
                let diagnosesSum = {};
                if (documentations.length>0){
                    getPatient.data.map(x=>{
                        documentations.map(y=>{
                            if(y._id.toString() === x.patientId.toString()){
                                diagnosesSum.age = y.age;
                                diagnosesSum.apmisId = y.personDetails.apmisId;
                                diagnosesSum.gender = y.personDetails.gender;
                                diagnosesSum.patientId=x.patientId;
                                diagnosesSum.patientName= x.patientName;
                                //diagnosesSum.ICD10Code= (x.document.body.ICD10Diagnosis!==undefined)?x.document.body.ICD10Diagnosis:'No ICD10 Diagnoses found!';
                                //diagnosesSum.diagnosis= (x.document.body.ICD10Diagnosis!==undefined)?x.document.body.ICD10Diagnosis:'No ICD10 Diagnoses found!';
                                summary.push(diagnosesSum);
                            }
                        });
                        
                    });
                    
                }  return summary; 
            }
            
            
        } catch (error) {
            console.log('====================\n',error);
            return jsend.error(error);
        }

    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
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
        return Promise.resolve({ id });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
