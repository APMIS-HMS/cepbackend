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
        let id = data.id;

        var rawdata = data.base64;
        var matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
        const type = data.docType;
        var contentType = matches[1];
        var buffer = new Buffer(matches[2], 'base64');
        const container = data.container;

        var ext = fileType.split('/');
        if(data.container !== null){
            fileName = id + '_'+docType+ '_' + Date.now() +'.'+ ext[1];
            //Get facility
            let getFacility = facilityService.get(facilityId);
            //Get Person
            let getProfile = peoplesService.get(id);
            return new Promise(function (resolve, reject) {
                try {
                    blobSvc.createBlockBlobFromText(container, fileName,buffer,{ contentType: contentType }, (error,result) => {
                        if (result !== null) {
                            let file = blobSvc.getUrl(result.container, result.name);
                            if(error){
                                reject(error);
                            }else{
                                if(data.container === 'personcontainer'){
                                    let doc = {
                                        patientId: id,
                                        facilityId: facilityId,
                                        docType: docType,
                                        docName:docName,
                                        docUrl: file,
                                        fileType: fileType
                                    };
                    
                                    let createDoc = docUploadService.create(doc);
                                    // return createDoc; 
                                    result.data = createDoc;
                                    //return jsend.success(result); 
                                
                                }else if(data.container === 'logocontainer'){
                                    
                                    var promise = new Promise(function(resolve, reject) {
                                        if(getFacility._id !== undefined){
                                            resolve(getFacility);
                                        }
                                        else {
                                            reject(Error('Failed'));
                                        }
                                    });
                                    promise.then(function(result){
                                        getFacility.logoObject = file;
                                        let facUpdateLogo = facilityService.update(facilityId,getFacility);

                                        if(facUpdateLogo !== undefined){
                                            //console.log('====facUpdateLogo===\n',facUpdateLogo);
                                        }
                                    });
                                    
                                }
                                else if(data.container === 'personprofilecontainer'){
                                    let profile = {};
                                    
                                    if(getProfile._id !== undefined){
                                        //console.log('====getProfile=====\n',getProfile);
                                    }
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
