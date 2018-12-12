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
                    let femaleFamilyCover = 0;
                    let femaleCompanyCover = 0;
                    let femaleHmo = 0;
                    let femalePrivatePatient = 0;
                    let maleFamilyCover = 0;
                    let maleCompanyCover = 0;
                    let maleHmo = 0;
                    let malePrivatePatient = 0;
                    let personDetails = getPatients.data.map(x=>{
                        ageStr = x.age.substr(0,2);
                        let age;
                        let checkMonth = x.age.split(' ');

                        if(checkMonth[1].charAt(0).toLowerCase()==='y'){
                            age = parseInt(ageStr);
                        }
                        else if(checkMonth[1].charAt(0).toLowerCase()==='m'){
                            age = parseInt(ageStr)/100;
                        }
                        
                        // Total male patient count in  facility
                        if(x.personDetails.gender.toLowerCase()==='male'){
                            totalMaleCount +=1;

                            if(x.paymentPlan[0].planType.toLowerCase() === 'wallet' && x.paymentPlan[0].isDefault===true){
                                malePrivatePatient +=1;
                            }
                            if(x.paymentPlan[0].planType.toLowerCase() === 'hmo' && x.paymentPlan[0].isDefault===true){
                                maleHmo +=1;
                            }
                            if(x.paymentPlan[0].planType.toLowerCase() === 'companycover' && x.paymentPlan[0].isDefault===true){
                                maleCompanyCover +=1;
                            }
                            if(x.paymentPlan[0].planType.toLowerCase() === 'familycover' && x.paymentPlan[0].isDefault===true){
                                maleFamilyCover +=1;
                            }
                        }
                        // Total female patient count in  facility
                        if(x.personDetails.gender.toLowerCase()==='female'){
                            totalFemaleCount +=1;

                            if(x.paymentPlan[0].planType.toLowerCase() === 'wallet' && x.paymentPlan[0].isDefault===true){
                                femalePrivatePatient +=1;
                            }
                            if(x.paymentPlan[0].planType.toLowerCase() === 'hmo' && x.paymentPlan[0].isDefault===true){
                                femaleHmo +=1;
                            }
                            if(x.paymentPlan[0].planType.toLowerCase() === 'companycover' && x.paymentPlan[0].isDefault===true){
                                femaleCompanyCover +=1;
                            }
                            if(x.paymentPlan[0].planType.toLowerCase() === 'familycover' && x.paymentPlan[0].isDefault===true){
                                femaleFamilyCover +=1;
                            }
                            
                        }
                        // Total male patient count grouped by age
                       
                        if(age <= 10 && x.personDetails.gender.toLowerCase()==='male'){
                            ageCount += 1;
                            
                            if(x.personDetails.gender.toLowerCase()==='male'){
                                maleCount += 1;
                            }else if(x.personDetails.gender.toLowerCase()==='female'){
                                femaleCount += 1;
                            }
                        }
                        // Total female patient count grouped by age 
                        if(age <= endAge && x.personDetails.gender.toLowerCase()==='female'){
                            ageCount += 1;
                            
                        }
                        //Get all patient payment plan
                        payment.push(...x.paymentPlan);

                        return {
                            apmisId:x.personDetails.apmisId,
                            patientName:x.personDetails.firstName,
                            gender:x.personDetails.gender, 
                            age:age,
                            address:x.personDetails.homeAddress, 
                            phone:x.personDetails.primaryContactPhoneNo,
                            dateCreated:x.createdAt
                        };
                    });

                    //Get count of all patient payment plan
                    let familyCovercount = 0;
                    let companyCovercount = 0;
                    let hmoCount = 0;
                    let privatePatientCount = 0;

                    if(payment.length >0){

                        payment.map(x=>{
                            if(x.planType.toLowerCase() === 'wallet' && x.isDefault===true){
                                privatePatientCount +=1;
                            }
                            if(x.planType.toLowerCase() === 'hmo' && x.isDefault===true){
                                hmoCount +=1;
                            }
                            if(x.planType.toLowerCase() === 'companycover' && x.isDefault===true){
                                companyCovercount +=1;
                            }
                            if(x.planType.toLowerCase() === 'familycover' && x.isDefault===true){
                                familyCovercount +=1;
                            }
                        });

                        
                    }

                    //Patient summary by plan
                    if(params.query.searchBy === 'plantype'){

                        if(params.query.searchBy.toLowerCase() === 'hmo'){
                            paymentPlan ={
                                'hmo':hmoCount
                            };
                        }
                        if(params.query.searchBy.toLowerCase() === 'familycover'){
                            paymentPlan.plan ={
                                'familyCover':familyCovercount
                            };
                        }
                        if(params.query.searchBy.toLowerCase() === 'companycover'){
                            paymentPlan.plan ={
                                'companyCover':companyCovercount
                            };
                        }
                        if(params.query.searchBy.toLowerCase() === 'privatepatient'){
                            paymentPlan.plan ={
                                'privatePatient':privatePatientCount
                            };
                        }
                        else if(params.query.searchBy.toLowerCase() ==='plantype'){
                            let data = []; // Will take this out later
                            let hmo={},familyCover={},companyCover={},privatePatient={};
                            //HMO
                            hmo.type ='hmo';
                            hmo.totalPatient = hmoCount;
                            hmo.male = maleHmo;
                            hmo.female=femaleHmo;
                            data.push(hmo);
                            //Family cover
                            familyCover.type = 'familyCover';
                            familyCover.totalPatient = familyCovercount;
                            familyCover.male = maleFamilyCover;
                            familyCover.female = femaleFamilyCover;
                            data.push(familyCover);
                            //Company cover
                            companyCover.type='companyCover';
                            companyCover.totalPatient=companyCovercount;
                            companyCover.male = maleCompanyCover;
                            companyCover.female = femaleCompanyCover;
                            data.push(companyCover);
                            //privat Patient
                            privatePatient.type ='privatePatient';
                            privatePatient.totalPatient = privatePatientCount;
                            privatePatient.male = malePrivatePatient;
                            privatePatient.female = femalePrivatePatient;
                            data.push(privatePatient);
                            paymentPlan=data;
                        }
                        return jsend.success(paymentPlan);
                    }
                    // Patient summary filtered by  gender
                    if(params.query.searchBy === 'gender'){
                        summary.totalMaleCount = totalMaleCount;
                        summary.totalFemaleCount = totalFemaleCount;

                        return jsend.success(summary);
                    }

                    //Age ranges

                    if(params.query.searchBy === 'age'){
                        let ageGroup = {};
                        let ageRanges ={};
                        let femaleGenderCount={};
                        let maleGenderCount={};
                        let data = [];
                        let summary = {};
                        ageGroup['0-10']=0,ageGroup['11-20']=0,ageGroup['21-30']=0,ageGroup['31-40']=0,ageGroup['41-50']=0,ageGroup['51-above']=0;
                        femaleGenderCount['0-10']=0,femaleGenderCount['11-20']=0,femaleGenderCount['21-30']=0,
                        femaleGenderCount['31-40']=0,femaleGenderCount['41-50']=0,femaleGenderCount['51-above']=0;
                        maleGenderCount['0-10']=0,maleGenderCount['11-20']=0,maleGenderCount['21-30']=0,
                        maleGenderCount['31-40']=0,maleGenderCount['41-50']=0,maleGenderCount['51-above']=0;
                        var result = personDetails.map(x=>{
                            
                            if(x.age <= 1 && x.age < 11){
                                ageGroup['0-10']+=1;
                                summary['']='';
                                if(x.gender.toLowerCase()==='male'){
                                    maleGenderCount['0-10']+=1;
                                }else{
                                    femaleGenderCount['0-10']+=1;
                                }
                            }
                            if(x.age >= 11 && x.age < 21 ){
                                ageGroup['11-20']+=1;
                                if(x.gender.toLowerCase()==='male'){
                                    maleGenderCount['11-20']+=1;
                                }else{
                                    femaleGenderCount['11-20']+=1;
                                }
                            }
                            if(x.age >= 21 && x.age < 31){
                                ageGroup['21-30']+=1;
                                if(x.gender.toLowerCase()==='male'){
                                    maleGenderCount['21-30']+=1;
                                }else{
                                    femaleGenderCount['21-30']+=1;
                                }
                            }
                            if(x.age >= 31 && x.age < 41){
                                ageGroup['31-40']+=1;
                                if(x.gender.toLowerCase()==='male'){
                                    maleGenderCount['31-40']+=1;
                                }else{
                                    femaleGenderCount['31-40']+=1;
                                }
                            }
                            if(x.age >= 41 && x.age < 51){
                                ageGroup['41-50']+=1;
                                if(x.gender.toLowerCase()==='male'){
                                    maleGenderCount['41-50']+=1;
                                }else{
                                    femaleGenderCount['41-50']+=1;
                                }
                            }
                            if(x.age >= 51 && x.age > 51){
                                ageGroup['51-above']+=1;
                                if(x.gender.toLowerCase()==='male'){
                                    maleGenderCount['51-above']+=1;
                                }else{
                                    femaleGenderCount['51-above']+=1;
                                }
                            }
                            ageRanges.tag = ageGroup;
                            ageRanges.male = maleGenderCount;
                            ageRanges.female = femaleGenderCount;
                            return {
                                ageRanges
                            };
                        });//

                        return jsend.success([... new Set(result.map(x => x.ageRanges))]);
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
