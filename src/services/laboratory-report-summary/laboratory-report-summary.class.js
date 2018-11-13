/* eslint-disable no-unused-vars */
let jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    find(params) {
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    async create(data, params) {
        const LaboratoryReportsService = this.app.service('laboratory-reports');
        const LaboratoryRequestService = this.app.service('laboratory-requests');

        let labSummary = {
            apmisId : String,
            patientName : String,
            status : String,
            clinic : String,
            doctor :String,
            request : String,
            date  : new  Date()
        };

        let investigationReportByLocation={};
        let investigationReportByBench = {};
        let labWorkBenches = [];
        let workBenches = [];
        let workBench = {};
        let labRequests = [];
        let labReports;
        let investigations;
        let investigation;

        let facilityId = data.facilityId;
        try {
            const getLabRequest = await LaboratoryRequestService.find({query:{facilityId:facilityId}});
            
            labRequests = getLabRequest.data;
            
            if(labRequests.length >0){
                investigations = labRequests.map(x=>{
                    return x.investigations;
                });
                //return jsend.success(investigations);
                investigation = investigations.map(x=>{
                    return x[0].investigation;});

                labWorkBenches = investigation.map(x=>{
                    return x.LaboratoryWorkbenches;
                });

                workBenches = labWorkBenches.map(x=>{
                    return x[0].workbenches[0].workBench;
                });
                
                const getLabReport = await LaboratoryReportsService.find({query:{facilityId:facilityId}});
                labReports = getLabReport.data;
                if(labReports.length >0){
                    labReports.forEach(report =>{
                        labRequests.forEach(request=>{
                            if(report.patientId === request.patientId){
                                labSummary.request = '';
                            }
                        });
                    });
                }
                return jsend.success(getLabReport);
            }
        } catch (error) {
            //console.log('===error===\n',error);
            return jsend.error({message:'There was an errror while ',code:422, data:{error} });
        }

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

    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
