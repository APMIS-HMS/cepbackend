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

        let summaryByLoc = {
            request: String,
            total: Number
        };
        let summaryByBench = {
            name: String,
            total: Number
        };
        let labReportSummary = {
            apmisId: String,
            patientName: String,
            status: String,
            doctor: String,
            request: Number,
            date: Date
        };
        let labReportByLoc = {
            location: String,
            summary: summaryByLoc
        };

        let labReportByBench = {
            bench: String,
            summary: summaryByBench
        };
        try {
            let getLabReport;
            if (params.query.startDate !== undefined && params.query.endDate === undefined) {
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
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$kip)?params.query.$skip:0
                    }
                });
            }
            else if (params.query.startDate !== undefined && params.query.endDate !== undefined) {
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
                        ],
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$kip)?params.query.$skip:0
                    }
                });
            }// Search by querystring
            else if (params.query.queryString !== undefined) {
                getLabReport = await LabReportService.find({
                    query: params.query,
                    $limit: (params.query.$limit) ? params.query.$limit : 10,
                    $skip:(params.query.$kip)?params.query.$skip:0
                });
            }
            // Search by all
            else if (params.query.searchBy !== undefined) {
                getLabReport = await LabReportService.find({ query: { 
                    facilityId: facilityId,
                    $limit: (params.query.$limit) ? params.query.$limit : 10,
                    $skip:(params.query.$kip)?params.query.$skip:0 
                } });
            }
            else {
                getLabReport = await LabReportService.find({
                    query: {
                        facilityId: facilityId,
                        updatedAt: { $lte: Date.now() },
                        $limit: (params.query.$limit) ? params.query.$limit : 10,
                        $skip:(params.query.$kip)?params.query.$skip:0

                    }
                });
            }


            //Filter request Ids from report
            let requestIds = getLabReport.data.map(x => {
                return x.requestId;
            });
            //Get requests by Ids
            let labRequests = await LabRequestService.find({
                query: {
                    '_id': { $in: requestIds },
                }
            });

            let workbenches = getLabReport.data.map(x => {
                return x.workBench;
            });
            let locations = workbenches.map(x => {
                return x.minorLocationId;
            });
            //return jsend.success(locations);
            let getFac = await FacilityService.find({
                query: {
                    _id: facilityId,
                    $select: ['minorLocations']
                }
            });
            let newLoc = []; let results = [];
            //Get all minor locations from facility based on fac id
            // filter the data needed
            let locationObj = [...new Set(locations.map(x => x))];
            if (getFac.data.length > 0) {
                let getMinorLocation = getFac.data[0].minorLocations.map(loc => {
                    return {
                        locationId: loc._id,
                        location: loc.name,
                    };

                });


                getMinorLocation.map(x => {
                    locationObj.map(y => {
                        if (x.locationId.toString() === y.toString()) {
                            results.push(x);
                        }
                    });
                });

                // workbenches.map(x=>{
                //     results.map(y=>{
                //         if(x.minorLocationId.toString()=== y.locationId){
                //             bench.locationId = y.locationId;
                //             bench.location =y.name;
                //             //bench.

                //         }
                //     });
                // });
                //return jsend.success(results); 
            }

            if (params.query.location !== true) {
                summaryByLoc.total = locations.length;
            }
            if (params.query.bench !== undefined) {
                summaryByBench.total = workbenches.length;
            }
            let summary = [];
            let laboratoryReport = {};
            let newLabRequest = labRequests.data.map((x, i) => {
                return {
                    patientDetails: x.personDetails,
                    investigation: x.investigations,
                    patientId: x.patientId,
                    status: x.isUploaded,
                    date: x.createdAt,
                    doctor:x.employeeDetails.firstName+' '+x.employeeDetails.lastName,
                    workBench: (x.investigations[i].investigation.LaboratoryWorkbenches[i] !== undefined) ?
                        x.investigations[i].investigation.LaboratoryWorkbenches[i].workbenches[i].workBench : 'No Workbench found'

                };
            });
            let locSum = [];
            let count = 0;
            if (labRequests.data.length > 0) {
                newLabRequest.forEach((patient, i) => {
                    let fullName = patient.patientDetails.firstName +' '+patient.patientDetails.lastName;
                    labReportSummary.apmisId = patient.patientDetails.apmisId;
                    labReportSummary.patientName = fullName;
                    labReportSummary.patientId = patient.patientId;
                    labReportSummary.doctor = patient.doctor;
                    labReportSummary.status = patient.investigation[i].isUploaded;
                    labReportSummary.date = patient.date;
                    labReportSummary.request = patient.investigation[i].investigation.name;
                    locSum.push(patient.investigation[i].investigation.name);

                    summary.push(labReportSummary);
                });
                //return locSum;
                var location = {};
                //results.forEach(function (x) {
                //counts[x.name]=[];
                locSum.forEach(element=>{
                    summaryByLoc.request=element;
                    location[element]= (location[element.resquest] || 0) + 1;
                    summaryByLoc.total =location;
                });
                   
                //});

                laboratoryReport = summary;
                getLabReport.data = summary;
                getLabReport.location = location;
                //laboratoryReport.location = location;
                // laboratoryReport.bench = summaryByBench;
                return getLabReport;
            }
        } catch (error) {
            console.log('==========\n', error);
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
