/* eslint-disable no-unused-vars */
var azure = require('azure-storage');
let jsend = require('jsend');
const mongoose = require('mongoose');
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
        const peopleService = this.app.service('people');
        const docUploadService = this.app.service('doc-upload');

        //Get azure Key used for establishing connection to APMIS VM
        const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
        //Create the connection
        var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
        //Declare and initialise global variabls and constants
        let fileName;
        let docType = data.docType;
        let facilityId = data.facilityId;
        let mimeType = data.mimeType;
        let docName = data.docName;
        let id = data.id;

        var rawdata = data.base64;
        var matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
        var contentType = matches[1];
        var buffer = new Buffer(matches[2], 'base64');
        const container = data.container;
        let destination;
        const user = data.user;

        var ext = mimeType.split('/');
        let file;

        let profilePixObj;
        let facUpdateLogo;
        //Check if container is part of the data sent (container is a required field)
        //Container is the azure db for the file that is to be uploaded
        if (data.container !== null) {
            //Genarate a unique name for the file that is to be uploaded
            //fileName  = mongoose.Types.ObjectId() +'.'+ ext[1];

            let fileNewName  = mongoose.Types.ObjectId() +'.'+ ext[1];
            
            fileName = id + '_' + docType + '_' + fileNewName;
            //Define the destination of the upload file (its actually the path to the image/doc)
            //destination = user + '/' + id + '/' + fileName;
            //Get facility.
            let getFacility = await facilityService.get(facilityId);
            //Get Person
            let getProfile = await  peopleService.get(id);
            let finalResponse={};
            let createDoc;

            try {
                //upload file
                const blolSvcCall = await blobSvc.createBlockBlobFromText(container, fileName, buffer, { contentType: contentType }, (error, result) => {
                    file = blobSvc.getUrl(result.container, result.name);
                });

                if (blolSvcCall.name !== undefined) {
                    
                    //If no error (upload successful), save to local db
                    if (data.container === 'personcontainer') {

                        let doc = {
                            patientId: id,
                            facilityId: facilityId,
                            docType: docType,
                            docName: fileName,
                            docUrl: file,
                            fileType: mimeType
                        };
                        let payload = JSON.stringify(doc);

                       // createDoc = await docUploadService.create(payload); 
                        
                        return jsend.success(doc); 

                    } else if (data.container === 'logocontainer') {
                        let logoObject = {
                            originalname: docName,
                            encoding: 'base64',
                            mimetype: mimeType,
                            destination: destination,
                            filename: fileName,
                            path: file,
                            size: data.size,
                            thumbnail: file,
                            detailthumbnail: file
                        };

                        getFacility.logoObject = logoObject;

                        facUpdateLogo = await facilityService.update(facilityId, getFacility, {});
                        finalResponse = facUpdateLogo;
                        return jsend.success(finalResponse);
                    }
                    else if (data.container === 'profilepicturecontainer') {
                        let profileImageObject = {
                            originalname: docName,
                            encoding: 'base64',
                            mimetype: mimeType,
                            destination: destination,
                            filename: fileName,
                            path: file,
                            size: data.size,
                            thumbnail: file,
                            detailthumbnail: file
                        };
                        getProfile.profileImageObject =profileImageObject;

                        profilePixObj = await peopleService.update(id,getProfile,{});
                        
                        finalResponse.profile = profilePixObj;
                        return jsend.success(finalResponse); 
                        
                    }
                }

            } catch (error) {
                return jsend.error({ message: 'Upload failed', code: 208, data: { error: error } });
            }
            
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
