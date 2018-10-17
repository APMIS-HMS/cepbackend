/* eslint-disable no-unused-vars */
const azure = require('azure-storage');
const jsend = require('jsend');
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
        const azureBlobService = this.app.service('azure-blob');

        //Get azure Key used for establishing connection to APMIS VM
        const ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
        //Create the connection
        var blobSvc = azure.createBlobService('apmisstorageaccount', ACCESS_KEY);
        //Declare and initialise global variabls and constants
        let fileName;
        let docType = data.docType;
        let facilityId = data.facilityId;
        let mimeType = data.mimeType;
        let id = data.id;
        let uploadType = data.uploadType;
        let rawdata;
        var uploadFile = data.base64;
        var contains = uploadFile.includes('data:'+mimeType+';base64,');
        if(contains){
            rawdata = data.base64;
        }else{
            rawdata = 'data:'+mimeType+';base64,';
            rawdata = rawdata + new Buffer(data.base64).toString('base64'); 
        }
        
        let matches = rawdata.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
        let contentType = matches[1];
        let buffer = new Buffer(matches[2], 'base64');
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
            fileName = mongoose.Types.ObjectId() + '.' + ext[1];

            //let fileNewName = mongoose.Types.ObjectId() + '.' + ext[1];

            //fileName = data.id + '_' + docType + '_' + fileNewName;
            //Define the destination of the upload file (its actually the path to the image/doc)
            const facilityPath = id + '/' + uploadType + '/' + fileName;
            const personPath = user + '/' + id + '/' + uploadType + '/' + fileName;
            if (id === facilityId) {
                destination = facilityPath;
            } else {
                destination = personPath;
            }



            let finalResponse = {};
            let createDoc;

            try {
                //upload file
                const blob = {
                    blobSvc: blobSvc,
                    container: container,
                    fileName: destination,
                    buffer: buffer,
                    contentType: contentType
                };
                const blolSvcCall_ = await azureBlobService.create(blob, {});
                // console.log(blolSvcCall_);
                file = blobSvc.getUrl(blolSvcCall_.container, blolSvcCall_.name);


                if (blolSvcCall_.name !== undefined) {

                    //If no error (upload successful), save to local db
                    if (data.container === 'personfolder') {

                        let doc = {
                            patientId: data.id,
                            facilityId: facilityId,
                            docType: docType,
                            docName: fileName,
                            docUrl: file,
                            fileType: mimeType
                        };
                        createDoc = await docUploadService.create(doc);

                        return jsend.success(createDoc);

                    } else if (data.container === 'facilityfolder') {
                        //Get facility.
                        let getFacility = await facilityService.get(facilityId);
                        id = facilityId;
                        let logoObject = {
                            //originalname: docName,
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
                    else if (data.uploadType === 'profilePicture') {
                        //Get Person
                        id = data.id;
                        let getProfile = await peopleService.get(id);

                        let profileImageObject = {
                            //originalname: docName,
                            encoding: 'base64',
                            mimetype: mimeType,
                            destination: destination,
                            filename: fileName,
                            path: file,
                            size: data.size,
                            thumbnail: file,
                            detailthumbnail: file
                        };
                        getProfile.profileImageObject = profileImageObject;

                        profilePixObj = await peopleService.update(id, getProfile, {});

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
