/* eslint-disable no-unused-vars */
const jsend = require('jsend');
const requestPromise = require('request-promise');
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
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const inventoriesService = this.app.service('inventories');
    const productsService = this.app.service('products');
    const orgService = this.app.service('organisation-services');
    const facilityPriceService = this.app.service('facility-prices');
    if (params.query.isArray) {
      const facilityId = data[0].product.facilityId;
      const storeId = data[0].storeId;
      const productIds = data.map((product) => {
        return product.product.productObject.id;
      });
      let inventory = await inventoriesService.find({
        query: {
          facilityId: facilityId,
          productId: {
            $in: productIds
          },
          storeId: storeId
        }
      });

      let resultList = [];
      try {
        for (const product of data) {
          let service = {};
          let index = null;
          let orgServiceValue = {};
          service.name = product.product.productObject.name;
          let awaitOrganService = await orgService.get(product.facilityServiceId);
          try {
            awaitOrganService.categories.forEach((item, i) => {
              if (item._id.toString() === product.categoryId.toString()) {
                item.services.push(service);
                index = i;
              }
            });
          } catch (error) {}

          const payResult = await orgService.patch(awaitOrganService._id, awaitOrganService);
          payResult.categories.forEach((itemi, i) => {
            if (itemi._id.toString() === product.categoryId.toString()) {
              itemi.services.forEach((items, s) => {
                if (items.name === service.name) {
                  orgServiceValue.serviceId = items._id;
                }
              });
            }
          });

          let batches = product;
          let inventoryModel = {};
          inventoryModel.facilityId = batches.product.facilityId;
          inventoryModel.storeId = batches.storeId;
          inventoryModel.serviceId = orgServiceValue.serviceId;
          inventoryModel.categoryId = product.categoryId;
          inventoryModel.facilityServiceId = product.facilityServiceId;
          inventoryModel.productId = batches.product.productObject.id;
          inventoryModel.productObject = batches.product.productObject;
          inventoryModel.transactions = [];
          inventoryModel.totalQuantity = 0;
          inventoryModel.availableQuantity = 0;
          inventoryModel.costPrice = product.costPrice;

          const url = process.env.NODE_ENV ?
            process.env.NODE_ENV :
            'http://localhost:3030' + '/get-scdc-by-sbd-code/' + inventoryModel.productObject.code;

          const url2 = process.env.NODE_ENV ?
            process.env.NODE_ENV :
            'http://localhost:3030' + '/get-scdc-by-sbd-code/' + inventoryModel.productObject.code + '?fromSCD=true';

          const options = {
            method: 'GET',
            uri: url
          };

          const options2 = {
            method: 'GET',
            uri: url2
          };

          try {
            const [result1, result2] = await Promise.all([requestPromise(options), requestPromise(options2)]);
            let parsed;
            if (JSON.parse(result1).length > 0) {
              parsed = JSON.parse(result1);
            } else if (JSON.parse(result2).length > 0) {
              parsed = JSON.parse(result2);
            } else {
              parsed = [];
            }
            // const parsed = JSON.parse(makeRequest);
            inventoryModel.productObject.ingredientCodes = parsed.map(ing => ing.CODE);
            inventoryModel.productObject.ingredientNames = parsed.map(ing => ing.STR);
          } catch (e) {}

          let len = batches.batchItems.length - 1;
          for (let index = len; index >= 0; index--) {
            if (index >= 0) {
              inventoryModel.totalQuantity += batches.batchItems[index].quantity;
              inventoryModel.availableQuantity += batches.batchItems[index].quantity;
              inventoryModel.transactions.push(batches.batchItems[index]);
            }
          }
          inventoryModel.margin = product.margin;
          let inventory = await inventoriesService.create(inventoryModel);
          let res = {
            inventory: inventory
          };

          let price = {
            facilityServiceId: inventory.facilityServiceId,
            categoryId: inventory.categoryId,
            serviceId: inventory.serviceId,
            modifieres: [],
            price: product.sellingPrice,
            facilityId: facilityId
          };

          const createdPrice = await facilityPriceService.create(price);

          resultList.push(res);
        }
        return jsend.success(resultList);
      } catch (error) {}
    } else {
      let inventory = await inventoriesService.find({
        query: {
          facilityId: data.product.facilityId,
          productId: data.product.productObject.id,
          storeId: data.storeId
        }
      });
      if (inventory.data.length > 0) {
        return {};
      } else {
        let service = {};
        let index = null;
        let orgServiceValue = {};
        service.name = data.product.productObject.name;
        let awaitOrganService = await orgService.get(data.facilityServiceId);
        awaitOrganService.categories.forEach((item, i) => {
          if (item._id.toString() === data.categoryId.toString()) {
            item.services.push(service);
            index = i;
          }
        });
        const payResult = await orgService.patch(awaitOrganService._id, awaitOrganService);
        payResult.categories.forEach((itemi, i) => {
          if (itemi._id.toString() === data.categoryId.toString()) {
            itemi.services.forEach((items, s) => {
              if (items.name === service.name) {
                orgServiceValue.serviceId = items._id;
              }
            });
          }
        });
        let batches = data;
        let inventoryModel = {};
        inventoryModel.facilityId = batches.product.facilityId;
        inventoryModel.storeId = batches.storeId;
        inventoryModel.serviceId = orgServiceValue.serviceId;
        inventoryModel.categoryId = data.categoryId;
        inventoryModel.facilityServiceId = data.facilityServiceId;
        inventoryModel.productId = batches.product.productObject.id;
        inventoryModel.productObject = batches.product.productObject;
        inventoryModel.transactions = [];
        inventoryModel.totalQuantity = 0;
        inventoryModel.availableQuantity = 0;

        let len = batches.batchItems.length - 1;
        for (let index = len; index >= 0; index--) {
          if (index >= 0) {
            inventoryModel.totalQuantity += batches.batchItems[index].quantity;
            inventoryModel.availableQuantity += batches.batchItems[index].quantity;
            inventoryModel.transactions.push(batches.batchItems[index]);
          }
        }
        let inventory = await inventoriesService.create(inventoryModel);
        let res = {
          inventory: inventory
        };
        return res;
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
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
