/* eslint-disable no-unused-vars */
const format = require('date-fns/format');
//const formatDistance = require('date-fns/formatDistance');
//const subDays = require('date-fns/subDays');
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
        let facilityId = params.query.facilityId;
        let startAge = params.query.startAge;
        let endAge = params.query.endAge;
        let startDate = params.query.startDate;
        let endDate = params.query.endDate;
        let date = new Date();
        let ageRange = {};
        let totalMaleCount = 0;
        let totalFemaleCount = 0;
        let payment = [];
        let plan = {};
        let paymentPlan={};
        
        let getPatients;
        try {
            if(facilityId!==undefined){
                //ageRange['range']=[];
                let summary = {};
                let maleCount = 0;
                let femaleCount = 0;
                let ageCount = 0;
                if(params.query.startDate !== undefined){
                //startDate = date;
                // return jsend.success(format(startDate));
                    getPatients = await PatientService.find({
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
                }else if(params.query.apmisId !== undefined){
                    getPatients = await PatientService.find({
                        query:{
                            facilityId:facilityId,
                            apmisId:params.query.apmisId,
                            $limit: (params.query.$limit) ? params.query.$limit : 10,
                            $skip:(params.query.$skip)?params.query.$skip:0
                        }
                    });
                }
                else{
                    getPatients = await PatientService.find({
                        query:{
                            facilityId:facilityId,
                            // $and: [{
                            //     createdAt: {
                            //         $gte: date
                            //     }
                            // },
                            // {
                            //     createdAt: {
                            //         $lte: endDate // endDate = startDate minus 7 days
                            //     }
                            // }
                            // ],
                            $limit: (params.query.$limit) ? params.query.$limit : 10,
                            $skip:(params.query.$skip)?params.query.$skip:0
                        }});
                }
                if (getPatients.data.length>0){
                    let ageStr;
                    let personDetails = getPatients.data.map(x=>{
                        ageStr = x.age.substr(0,2);
                        let age = parseInt(ageStr);
                        // Total male patient count in  facility
                        if(x.personDetails.gender.toLowerCase()==='male'){
                            totalMaleCount +=1;
                        }
                        // Total female patient count in  facility
                        if(x.personDetails.gender.toLowerCase()==='female'){
                            totalFemaleCount +=1;
                        }
                        // Total male patient count grouped by age
                        if(age <= endAge && x.personDetails.gender.toLowerCase()==='male'){
                            ageCount += 1;

                            maleCount += 1;
                        }
                        // Total female patient count grouped by age 
                        if(age <= endAge && x.personDetails.gender.toLowerCase()==='female'){
                            ageCount += 1;
                            femaleCount += 1;
                        }
                        //Get all patient payment plan
                        payment.push(...x.paymentPlan);

                        return {
                            apmisId:x.personDetails.apmisId,
                            patientName:x.personDetails.firstName,
                            gender:x.personDetails.gender, 
                            age:x.age,
                            address:x.personDetails.homeAddress, 
                            phone:x.personDetails.primaryContactPhoneNo,
                            dateCreated:x.createdAt
                        };
                    });

                    //Get count of all patient payment plan
                    let familyCover = 0;
                    let companyCover = 0;
                    let hmo = 0;
                    let privatePatient = 0;

                    if(payment.length >0){

                        payment.map(x=>{
                            if(x.planType.toLowerCase() === 'wallet' && x.isDefault===true){
                                privatePatient +=1;
                            }
                            if(x.planType.toLowerCase() === 'hmo' && x.isDefault===true){
                                hmo +=1;
                            }
                            if(x.planType.toLowerCase() === 'companycover' && x.isDefault===true){
                                companyCover +=1;
                            }
                            if(x.planType.toLowerCase() === 'familycover' && x.isDefault===true){
                                familyCover +=1;
                            }
                        });

                        
                    }

                    //Patient summary by plan
                    if(params.query.plan !== undefined){
                        if(params.query.plan.toLowerCase() === 'hmo'){
                            paymentPlan.plan ={
                                'hmo':hmo
                            };
                        }
                        if(params.query.plan.toLowerCase() === 'familycover'){
                            paymentPlan.plan ={
                                'familyCover':familyCover
                            };
                        }
                        if(params.query.plan.toLowerCase() === 'companycover'){
                            paymentPlan.plan ={
                                'companyCover':companyCover
                            };
                        }
                        if(params.query.plan.toLowerCase() === 'privatepatient'){
                            paymentPlan.plan ={
                                'privatePatient':privatePatient
                            };
                        }
                        else if(params.query.plan ==='all'){
                            
                            paymentPlan.plan ={
                                'hmo':hmo,
                                'familyCover':familyCover,
                                'companyCover':companyCover,
                                'privatePatient':privatePatient
                            };
                        }
                        return jsend.success(paymentPlan);
                    }
                    // Patient summary filtered by  gender
                    if(params.query.gender !== undefined){
                        if(params.query.gender.toLowerCase() === 'male'){
                            summary.totalMaleCount = totalMaleCount;
                            return jsend.success(summary);
                        }else{
                            summary.totalFemaleCount = totalFemaleCount;
                            return jsend.success(summary);
                        }
                    }

                    // Patient summary filtered by  age range
                    if(params.query.startAge !== undefined && params.query.endAge !== undefined){

                        summary.female = femaleCount;
                        summary.male = maleCount;

                        ageRange.ageRange = summary;
                        return jsend.success(ageRange);
                    }
                    
                    return jsend.success(personDetails);
                }else{
                    return jsend.success([]);
                }
            }
            else{
                return jsend.error('Facility is undefined');
            }
            
        }catch (error) {
            console.log('================\n',error);
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
