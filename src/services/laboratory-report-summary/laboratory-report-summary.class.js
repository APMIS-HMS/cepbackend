/* eslint-disable no-unused-vars */
let jsend = require('jsend');
class Service {
    constructor(options) {
        this.options = options || {};
    }

    async find(params) {
        const LabRequestService = this.app.service('laboratory-requests');
        const LabReportService = this.app.service('laboratory-reports');
        const FacilityService = this.app.service('facilities');

        let facilityId = params.query.facilityId;
        console.log(facilityId);
        let labReportSummary ={
            apmisId : String,
            patientName : String,
            status : String,
            doctor :String,
            request : Number,
            date  : Date
        };
        
        let summaryByLoc ={
            request :String,
            total  : Number 
        };
        let summaryByBench={
            name:String,
            total:Number
        };
        let labReportByLoc ={
            location:String,
            summary:summaryByLoc
        };

        let labReportByBench = {
            bench:String,
            summary:summaryByBench
        };
        try { 
            let getLabReport;
            if(params.query.startDate !== undefined && params.query.endDate===undefined){
                //Get all reports filtered by facilityId and date range
                getLabReport = await LabReportService.find({
                    query: {
                        facilityId: facilityId,
                        $and: [{
                            updatedAt: {
                                $gte: params.query.startDate
                            }
                        },
                        {
                            updatedAt: {
                                $lte: Date.now()
                            }
                        }
                        ] 
                    }
                });
            }
            else if(params.query.startDate !==undefined && params.query.endDate!==undefined){
                //Get all reports filtered by facilityId and date range
                getLabReport = await LabReportService.find({
                    query: {
                        facilityId: facilityId,
                        $and: [{
                            updatedAt: {
                                $gte: params.query.startDate
                            }
                        },
                        {
                            updatedAt: {
                                $lte: params.query.endDate
                            }
                        }
                        ] 
                    }
                });
            }// Search by querystring
            else if(params.query.queryString !== undefined){
                getLabReport = await LabReportService.find({query:query.params});
            }
            // Search by all
            else if(params.query.searchBy !== undefined){
                getLabReport = await LabReportService.find({query:{facilityId: facilityId}});
            }
            else{
                getLabReport = await LabReportService.find({
                    query: {
                        facilityId: facilityId,
                        updatedAt: { $lte: Date.now() }

                    }
                });
            }
            
           
            //Filter request Ids from report
            let requestIds = getLabReport.data.map(x=>{
                return x.requestId;
            });
            //Get requests by Ids
            let labRequests = await LabRequestService.find({query:{
                '_id':{$in:requestIds},
            }});

            let workbenches = getLabReport.data.map(x=>{
                return x.workBench;
            });
            let locations = workbenches.map(x=>{
                return x.minorLocationId;
            });
            
            let getFac = await FacilityService.find({query:{facilityId:facilityId}});

            if(params.query.location !==true){
                summaryByLoc.total = locations.length;
            }
            if(params.query.bench !== undefined){
                summaryByBench.total = workbenches.length;
            }
            let summary=[];
            let laboratoryReport={};
            let newLapRequest=labRequests.data.map(x=>{
                return {
                    patientDetails:x.personDetails,
                    investigation:x.investigations,
                    patientId:x.patientId,
                    status:x.isUploaded,
                    date:x.createdAt

                };
            });
            if (labRequests.data.length >0) {
                newLapRequest.forEach((patient,i) =>{
                    labReportSummary.apmisId = patient.patientDetails.apmisId;
                    labReportSummary.patientName = patient.patientDetails.firstName;
                    labReportSummary.patientId = patient.patientId;
                    labReportSummary.doctor = patient.investigation[i].report.publishedById;
                    labReportSummary.status = patient.investigation[i].isUploaded;
                    labReportSummary.date = patient.date;
                    summary.push(labReportSummary);
                });
                labReportSummary.request = newLapRequest.map(x=>x.patientId).length;
                laboratoryReport.summary = summary;
                laboratoryReport.location =summaryByLoc;
                laboratoryReport.bench = summaryByBench;
                return laboratoryReport;
            }
        } catch (error) {
            return jsend.error({
                message: 'There was an errror while ',
                code: 422,
                data: {
                    error
                }
            });
        }

        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            id,
            text: `A new message with ID: ${id}!`
        });
    }


    async create(data, params) {
        
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
        return Promise.resolve({
            id
        });
    }

    setup(app) {
        this.app = app;
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
