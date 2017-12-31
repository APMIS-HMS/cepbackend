const users = require('./users/users.service.js');
const facilityModules = require('./facility-modules/facility-modules.service.js');
const facilityOwnerships = require('./facility-ownerships/facility-ownerships.service.js');
const facilityTypes = require('./facility-types/facility-types.service.js');
const facilityClasses = require('./facility-classes/facility-classes.service.js');
const titles = require('./titles/titles.service.js');
const locations = require('./locations/locations.service.js');
const relationships = require('./relationships/relationships.service.js');
const genders = require('./genders/genders.service.js');
const maritalStatuses = require('./marital-statuses/marital-statuses.service.js');
const getTokens = require('./get-tokens/get-tokens.service.js');
const facilities = require('./facilities/facilities.service.js');
const uploadImages = require('./upload-images/upload-images.service.js');
const countries = require('./countries/countries.service.js');
const people = require('./people/people.service.js');
const emailers = require('./emailers/emailers.service.js');
const patients = require('./patients/patients.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(facilityOwnerships);
  app.configure(facilityTypes);
  app.configure(facilityClasses);
  app.configure(facilityModules);
  app.configure(titles);
  app.configure(locations);
  app.configure(relationships);
  app.configure(genders);
  app.configure(maritalStatuses);
  app.configure(getTokens);
  app.configure(facilities);
  app.configure(uploadImages);
  app.configure(countries);
  app.configure(people);
  app.configure(emailers);
  app.configure(patients);
};
