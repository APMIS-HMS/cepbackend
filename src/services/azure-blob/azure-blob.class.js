/* eslint-disable no-unused-vars */
class Service {
    constructor(options) {
        this.options = options || {};
    }
    setup(app) {
        this.app = app;
    }

    find(params) {
        return Promise.resolve([]);
    }

    get(id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    create(data, params) {
        if(data.container !== null){
            if(data.container === 'facilityfolder' || data.container === 'personfolder'){
                return new Promise((resolve, reject) => {
                    data.blobSvc.createBlockBlobFromText(data.container, data.fileName, data.buffer, { contentType: data.contentType }, (error, result) => {
                        console.log(error);
                        if(error){
                            return resolve(error);
                        }
                        return resolve(result);
                    },err=>{
                        return reject(err);
                    });
                }); 
            }else{
                return new Promise((resolve,reject)=>{
                    reject('Invalid container supplied');
                });
            }
        }
       
        //console.log(data);

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
