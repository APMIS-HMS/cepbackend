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
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const inventoriesService = this.app.service('inventories');
    const storeRequisitionsService = this.app.service('store-requisitions');
    const inventoryTransactionService = this.app.service('inventory-transaction-types');
    const productOrganisationService = this.app.service('organisation-services');
    const inventoryTransactionTypes =await inventoryTransactionService.find({});
    const statusCount = data.products.filter(x => x.status === 'Completed');
    if (statusCount.length === data.products.length) {
      data.isSupplied = true;
    }
    data.products.map(x => {
      if (x.status === 'Completed') {
        x.iscompleted = true;
      }
    })
    const requisitedItems = await storeRequisitionsService.patch(data._id, {
      products: data.products
    }, {});
    for (let index = 0; index < data.products.length; index++) {
      const element = data.products[index];
      let inventory = await inventoriesService.find({
        query: {
          storeId: data.destinationStoreId,
          facilityId: data.facilityId,
          productId: element.productId
        }
      });
      let BatchId = '';
      let destinationStoreProduct = inventory.data[0];

      destinationStoreProduct.transactions.map(elt => {
        if (elt._id.toString() === element.transactionId.toString()) {
          elt.batchTransactions.push({
            inventorytransactionTypeId: inventoryTransactionTypes.data.find(x => x.name === 'transfer' && x.inorout === 'out')._id,
            quantity: element.quantityGiven,
            postQuantity: (elt.availableQuantity - element.quantityGiven),
            preQuantity: elt.availableQuantity,
            employeeId: data.employeeId,
            batchNumber: elt.batchNumber
          });
          elt.quantity = (elt.quantity - element.quantityGiven);
          elt.availableQuantity = (elt.availableQuantity - element.quantityGiven);
          BatchId = elt.batchNumber;
        }
      });
      destinationStoreProduct.totalQuantity -= element.quantityGiven;
      destinationStoreProduct.availableQuantity -= element.quantityGiven;
      await inventoriesService.patch(destinationStoreProduct._id, {
        transactions: destinationStoreProduct.transactions,
        totalQuantity: destinationStoreProduct.totalQuantity,
        availableQuantity: destinationStoreProduct.availableQuantity
      }, {});
      const receptorOfInventory = await inventoriesService.find({
        query: {
          storeId: data.storeId,
          facilityId: data.facilityId,
          productId: element.productId
        }
      });

      if (receptorOfInventory.data.length !== 0) {
        let receptorStoreProduct = receptorOfInventory.data[0];
        let checkBatch = receptorStoreProduct.transactions.filter(x => x.batchNumber === BatchId);
        if (checkBatch.length !== 0) {
          receptorStoreProduct.transactions.map(x => {
            if (x.batchNumber === BatchId) {
              x.batchTransactions.push({
                inventorytransactionTypeId: inventoryTransactionTypes.data.find(x => x.name === 'receive' && x.inorout === 'in')._id,
                quantity: element.quantityGiven,
                postQuantity: (x.availableQuantity + element.quantityGiven),
                preQuantity: x.availableQuantity,
                employeeId: data.employeeId,
                batchNumber: x.batchNumber
              });
              x.quantity = (x.quantity + element.quantityGiven);
              x.availableQuantity = (x.availableQuantity + element.quantityGiven);
            }
          });
          receptorStoreProduct.totalQuantity += element.quantityGiven;
          receptorStoreProduct.availableQuantity += element.quantityGiven;
        } else {
          let batchTransactions = [];
          batchTransactions.push({
            inventorytransactionTypeId: inventoryTransactionTypes.data.find(x => x.name === 'receive' && x.inorout === 'in')._id,
            quantity: element.quantityGiven,
            postQuantity: element.quantityGiven,
            preQuantity: 0,
            employeeId: data.employeeId,
            batchNumber: BatchId
          });
          receptorStoreProduct.transactions.push({
            adjustStocks: [],
            batchNumber: BatchId,
            quantity: element.quantityGiven,
            availableQuantity: element.quantityGiven,
            batchTransactions: batchTransactions
          });
          receptorStoreProduct.totalQuantity += element.quantityGiven;
          receptorStoreProduct.availableQuantity += element.quantityGiven;
        }

        await inventoriesService.patch(receptorStoreProduct._id, {
          transactions: receptorStoreProduct.transactions,
          totalQuantity: receptorStoreProduct.totalQuantity,
          availableQuantity: receptorStoreProduct.availableQuantity
        }, {});

      } else {
        let batchTransactions = [];
        batchTransactions.push({
          inventorytransactionTypeId: inventoryTransactionTypes.data.find(x => x.name === 'receive' && x.inorout === 'in')._id,
          quantity: element.quantityGiven,
          postQuantity: element.quantityGiven,
          preQuantity: 0,
          employeeId: data.employeeId,
          batchNumber: BatchId
        });
        let newProductToInventory = {
          facilityId: data.facilityId,
          storeId: data.storeId,
          serviceId: element.serviceId,
          categoryId: element.categoryId,
          facilityServiceId: element.facilityServiceId,
          productId: element.productId,
          productObject: element.productObject,
          totalQuantity: element.quantityGiven,
          availableQuantity: element.quantityGiven,
          transactions: [{
            batchNumber: BatchId,
            quantity: element.quantityGiven,
            availableQuantity: element.quantityGiven,
            adjustStocks: [],
            batchTransactions: batchTransactions,
          }]
        }

        await inventoriesService.create(newProductToInventory);
      }

    }
    return requisitedItems;
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
