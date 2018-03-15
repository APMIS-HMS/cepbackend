class Service {
  constructor(options) {
    this.options = options || {};
  }
  setup(app) {
    this.app = app;
  }
  async find(params) {
    console.log(params.query);
    const organisationService = this.app.service('organisation-services');
    const facilityPricesService = this.app.service('facility-prices');
    const serviceTagsService = this.app.service('service-tags');
    var awaitOrgServices = await organisationService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    let servicesItems = [];
    if (params.query.isQueryService === undefined) {
      servicesItems = awaitOrgServices.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
    } else {
      console.log("Am her");
      awaitOrgServices.data[0].categories.forEach(element => {
        console.log(element);
        const qIndex = element.services.filter(x => x.name.toLowerCase().includes(params.query.searchString.toLowerCase()));
        console.log(qIndex[0])
        if (qIndex.length > 0) {
          element.services = qIndex;
          servicesItems.push(element);
        }
      });
    }
    console.log(servicesItems);
    if (servicesItems.length > 0) {
      const sLen = servicesItems.length - 1;
      for (let b = sLen; b >= 0; b--) {
        console.log(b);
        let len3 = servicesItems[b].services.length - 1;
        for (let k = len3; k >= 0; k--) {
          console.log(k);
          servicesItems[b].services[k].price = [];
          var awaitPriceServices = await facilityPricesService.find({
            query: {
              facilityId: params.query.facilityId,
              categoryId: servicesItems[b]._id,
              serviceId: servicesItems[b].services[k]._id,
              facilityServiceId: awaitOrgServices.data[0]._id
            }
          });
          if (awaitPriceServices.data.length > 0) {
            let len5 = awaitPriceServices.data.length - 1;
            for (let n = 0; n <= len5; n++) {
              servicesItems[b].services[k].price.push({
                name: 'Base',
                isBase: true,
                priceId: awaitPriceServices.data[n]._id,
                price: awaitPriceServices.data[n].price
              });
              if (awaitPriceServices.data[n].modifiers !== undefined) {
                if (awaitPriceServices.data[n].modifiers.length > 0) {
                  let len6 = awaitPriceServices.data[n].modifiers.length - 1;
                  for (let m = 0; m <= len6; m++) {
                    if (awaitPriceServices.data[n].modifiers[m].tagId !== undefined) {
                      let tag = await serviceTagsService.get(awaitPriceServices.data[n].modifiers[m].tagId);
                      if (awaitPriceServices.data[n].modifiers[m].modifierType === 'Percentage') {
                        let p = awaitPriceServices.data[n].modifiers[m].modifierValue / 100;
                        let calculatedP = p * awaitPriceServices.data[n].price;
                        servicesItems[b].services[k].price.push({
                          name: tag.name,
                          isBase: false,
                          priceId: awaitPriceServices.data[n]._id,
                          _id: awaitPriceServices.data[n].modifiers[m]._id,
                          price: calculatedP,
                          modifierType: '%',
                          modifierValue: awaitPriceServices.data[n].modifiers[m].modifierValue
                        });
                      } else if (awaitPriceServices.data[n].modifiers[m].modifierType === 'Amount') {
                        servicesItems[b].services[k].price.push({
                          name: tag.name,
                          isBase: false,
                          priceId: awaitPriceServices.data[n]._id,
                          _id: awaitPriceServices.data[n].modifiers[m]._id,
                          price: awaitPriceServices.data[n].modifiers[m].modifierValue,
                          modifierType: 'Amt.',
                          modifierValue: awaitPriceServices.data[n].modifiers[m].modifierValue
                        });
                      }
                    }
                  }
                }
              }
            }
          } else {
            servicesItems[b].services[k].price.push({
              name: 'Base',
              isBase: true,
              price: 0
            });
          }
        }
      }
    }
    if (params.query.isQueryService === undefined) {
      return servicesItems[0];
    } else {
      console.log(servicesItems);
      return servicesItems;
    }

  }
  async create(data, params) {
    const orgService = this.app.service('organisation-services');
    const priceService = this.app.service('facility-prices');
    const tagDictioneriesService = this.app.service('tag-dictioneries');
    console.log(data);
    if (data.name !== null && data.name !== undefined) {
      const queryDico = await tagDictioneriesService.find({
        query: {
          word: {
            $regex: data.name.toString(),
            '$options': 'i'
          }
        }
      });
      if (queryDico.data.length == 0) {
        const exactWord = queryDico.data.filter(x => x.word.toLowerCase() === data.name.toLowerCase());
        if (exactWord.length == 0) {
          await tagDictioneriesService.create({
            word: data.name
          });
        }
      }
    }
    let organizationServiceItem = await orgService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    if (organizationServiceItem.data.length > 0) {
      if (params.query.isCategory.toString() === 'true') {
        organizationServiceItem.data[0].categories.push(data);
        let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
          categories: organizationServiceItem.data[0].categories
        });
        return updatedOrganizationService;
      } else {
        let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
        index[0].services.push(data);
        let lastIndex = 0;
        if (index[0].services.length > 0) {
          lastIndex = index[0].services.length - 1;
        }
        let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
          categories: organizationServiceItem.data[0].categories
        });
        let index2 = updatedOrganizationService.categories.filter(x => x._id.toString() === params.query.categoryId.toString());
        let serviceId = index2[0].services[lastIndex]._id;
        console.log(data.price);
        let priceItem = {
          facilityServiceId: updatedOrganizationService._id,
          categoryId: params.query.categoryId,
          serviceId: serviceId,
          facilityId: params.query.facilityId,
          price: data.price
        };
        if (priceItem.price === '') {
          priceItem.price = 0;
        }
        await priceService.create(priceItem);
        return updatedOrganizationService;
      }
    } else {
      if (data.categories === undefined) {
        data.categories = [];
      }
      data.categories.push({
        name: data.name
      });
      let createdOrgServiceItem = await orgService.create(data);
      return createdOrgServiceItem;
    }
  }
  async update(id, data, params) {
    const orgService = this.app.service('organisation-services');
    const priceService = this.app.service('facility-prices');
    const tagDictioneriesService = this.app.service('tag-dictioneries');
    if (params.query.name !== '') {
      let queryDico = await tagDictioneriesService.find({
        query: {
          word: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
      if (queryDico.data.length > 0) {
        let exactWord = queryDico.data.filter(x => x.word.toString().toLowerCase() === params.query.name.toString().toLowerCase());
        if (exactWord.length == 0) {
          await tagDictioneriesService.create({
            word: params.query.name
          });
        }
      } else {
        await tagDictioneriesService.create({
          word: params.query.name
        });
      }
    }
    let organizationServiceItem = await orgService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    if (organizationServiceItem.data.length > 0) {
      if (params.query.isCategory.toString() === 'true') {
        let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
        index[0].name = params.query.name;
      } else {
        let index = organizationServiceItem.data[0].categories.filter(x => x._id.toString() === params.query.categoryId.toString());
        let index2 = index[0].services.filter(x => x._id.toString() === params.query.serviceId.toString());
        if (index2.length > 0) {
          index2[0].name = data.name;
          index2[0].code = data.code;
          index2[0].panels = data.panels;
        }
      }
      let updatedOrganizationService = await orgService.patch(organizationServiceItem.data[0]._id, {
        categories: organizationServiceItem.data[0].categories
      });
      if (data.price !== undefined) {
        if (data.price.base.priceId !== undefined) {
          console.log(data.price);
          let getPrice = await priceService.get(data.price.base.priceId);
          getPrice.price = data.price.base.price;
          if (data.price.others !== undefined) {
            console.log(1);
            if (data.price.others.length > 0) {
              console.log(2);
              let len4 = data.price.others.length - 1;
              console.log(3);
              for (let t = 0; t <= len4; t++) {
                console.log('t-' + t);
                let index3 = getPrice.modifiers.filter(x => x._id.toString() === data.price.others[t]._id.toString());
                if (index3.length > 0) {
                  if (index3[0].modifierType === 'Percentage') {
                    console.log('Percentage');
                    index3[0].modifierValue = data.price.others[t].price;
                  } else if (index3[0].modifierValue === 'Amount') {
                    console.log('Percentage');
                    index3[0].modifierValue = data.price.others[t].price;
                  }
                }
              }
            }
          }
          await priceService.patch(getPrice._id, {
            price: getPrice.price,
            modifiers: getPrice.modifiers
          });
        } else {
          let priceItem = {
            facilityServiceId: updatedOrganizationService._id,
            categoryId: params.query.categoryId,
            serviceId: params.query.serviceId,
            facilityId: params.query.facilityId,
            price: data.price.base.price
          };
          await priceService.create(priceItem);
        }
      }
      return updatedOrganizationService;
    } else {
      return {};
    }
  }
}
module.exports = function (options) {
  return new Service(options);
};
module.exports.Service = Service;
