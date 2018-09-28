/* eslint-disable no-unused-vars */
var azure = require('azure-storage');
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
        const facilityService = this.app.service('facilities');
        const peoplesService = this.app.service('peoples');
        let docUploadService = this.app.service('doc-upload');
        const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
        var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
        console.log(blobSvc);
        let fileName;
        let docType = data.docType;
        let facilityId = data.facilityId;
        let fileType = data.fileType;
        let docName = data.docName;
        let id = data.patientId;

        var rawdata = data.base64;
        var matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
        const type = data.docType;
        var contentType = matches[1];
        var buffer = new Buffer(matches[2], 'base64');
        const container = data.container;

        //Get the facility. This can be done within the context it is to be used but
        // 'await' clause throws exception within a promise. Since the clause by itself is a promise, no need
        // to bother so much.
        let getFacility = await facilityService.get(facilityId);

        //Get the patient object from DB outside the promise
        let getPatient = await facilityService.get(id);

        //Get the patient object from DB outside the promise

        //let getPerson = await peoplesService.get(id);


        var ext = fileType.split('/');
        if(data.container !== null){
            fileName = id + '_'+docType+ '_' + Date.now() +'.'+ ext[1];

            return new Promise(function (resolve, reject) {
                try {
                    blobSvc.createBlockBlobFromText(container, fileName,buffer,{ contentType: contentType }, (error,result) => {
                        if (result !== null) {
                            let file = blobSvc.getUrl(result.container, result.name);
                            if(error){
                                reject(error);
                            }else{
                                //Update facilty collection locally
                                if(data.container === 'logocontainer'){
                                    getFacility.logoObject = file;
                                    let updateFacilityLogo = facilityService.update(facilityId, getFacility);
                                    result.data = updateFacilityLogo;
                                } // Insert ino docupload collection locally
                                else if(data.container === 'personcontainer'){
                                    let person =  {
                                        patientId: id,
                                        facilityId: facilityId,
                                        docType: docType,
                                        docName:docName,
                                        docUrl: file,
                                        fileType: fileType
                                    };
                    
                                    let createDoc = docUploadService.create(person);
                                    result.data = createDoc;
                                    console.log('\n====result=====\n',result);
                                }
                                //Updata person record locally
                                else if(data.container === 'personprofilecontainer'){
                                    getPatient.image = file;
                                    let updatePerson = peoplesService.update(id,getPatient);

                                    result.data = updatePerson;
                                }
                                resolve(result);
                            }
                          
                        }       
                    });
                } catch(error) {
                    return jsend.error({ message: 'Upload failed', code: 208, data: { error: error } });
                }
            });


        }
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
