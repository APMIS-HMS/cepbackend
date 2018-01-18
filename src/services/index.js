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
const smsSenders = require('./sms-senders/sms-senders.service.js');
const saveFacility = require('./save-facility/save-facility.service.js');
const savePerson = require('./save-person/save-person.service.js');
const employees = require('./employees/employees.service.js');
const appointments = require('./appointments/appointments.service.js');
const categoryTypes = require('./category-types/category-types.service.js');
const resendToken = require('./resend-token/resend-token.service.js');
const joinFacilityChannel = require('./join-facility-channel/join-facility-channel.service.js');
const serviceTags = require('./service-tags/service-tags.service.js');
const products = require('./products/products.service.js');
const billings = require('./billings/billings.service.js');
const invoices = require('./invoices/invoices.service.js');
const organisationServices = require('./organisation-services/organisation-services.service.js');
const inPatients = require('./in-patients/in-patients.service.js');
const inpatientTransferStatuses = require('./inpatient-transfer-statuses/inpatient-transfer-statuses.service.js');
const inpatientWaitingLists = require('./inpatient-waiting-lists/inpatient-waiting-lists.service.js');
const inpatientWaitingTypes = require('./inpatient-waiting-types/inpatient-waiting-types.service.js');
const vitaLocations = require('./vita-locations/vita-locations.service.js');
const vitalPositions = require('./vital-positions/vital-positions.service.js');
const vitalRythms = require('./vital-rythms/vital-rythms.service.js');
const forms = require('./forms/forms.service.js');
const formScopeLevels = require('./form-scope-levels/form-scope-levels.service.js');
const formTypes = require('./form-types/form-types.service.js');
const orderMgtTemplates = require('./order-mgt-templates/order-mgt-templates.service.js');
const facilityPrices = require('./facility-prices/facility-prices.service.js');
const diagnosises = require('./diagnosises/diagnosises.service.js');
const laboratoryRequests = require('./laboratory-requests/laboratory-requests.service.js');
const laboratoryReports = require('./laboratory-reports/laboratory-reports.service.js');
const documentations = require('./documentations/documentations.service.js');
const symptoms = require('./symptoms/symptoms.service.js');
const stores = require('./stores/stores.service.js');
const storeRequisitions = require('./store-requisitions/store-requisitions.service.js');
const inventoryTransactionTypes = require('./inventory-transaction-types/inventory-transaction-types.service.js');
const inventoryTransfers = require('./inventory-transfers/inventory-transfers.service.js');
const investigations = require('./investigations/investigations.service.js');
const investigationReportTypes = require('./investigation-report-types/investigation-report-types.service.js');
const purchaseEntries = require('./purchase-entries/purchase-entries.service.js');
const inventories = require('./inventories/inventories.service.js');
const purchaseOrders = require('./purchase-orders/purchase-orders.service.js');
const professions = require('./professions/professions.service.js');
const assignEmployeeUnit = require('./assign-employee-unit/assign-employee-unit.service.js');
const prescriptions = require('./prescriptions/prescriptions.service.js');
const prescriptionPriorities = require('./prescription-priorities/prescription-priorities.service.js');
const presentations = require('./presentations/presentations.service.js');
const productRoutes = require('./product-routes/product-routes.service.js');
const productTypes = require('./product-types/product-types.service.js');
const productVariants = require('./product-variants/product-variants.service.js');
const assignWorkspace = require('./assign-workspace/assign-workspace.service.js');
const workspaces = require('./workspaces/workspaces.service.js');
const appointmentTypes = require('./appointment-types/appointment-types.service.js');
const auditTray = require('./audit-tray/audit-tray.service.js');
const bedTypes = require('./bed-types/bed-types.service.js');
const clientTypes = require('./client-types/client-types.service.js');
const companycovers = require('./companycovers/companycovers.service.js');
const companycovercategories = require('./companycovercategories/companycovercategories.service.js');
const companyHealthCover = require('./company-health-cover/company-health-cover.service.js');
const consultingRoom = require('./consulting-room/consulting-room.service.js');
const corperateFacility = require('./corperate-facility/corperate-facility.service.js');
const dictionary = require('./dictionary/dictionary.service.js');
const dischargeType = require('./discharge-type/discharge-type.service.js');
const dispense = require('./dispense/dispense.service.js');
const dispenseAssessment = require('./dispense-assessment/dispense-assessment.service.js');
const docUpload = require('./doc-upload/doc-upload.service.js');
const drugStrength = require('./drug-strength/drug-strength.service.js');
const externalPrescription = require('./external-prescription/external-prescription.service.js');
const facilityAccessControl = require('./facility-access-control/facility-access-control.service.js');
const feature = require('./feature/feature.service.js');
const facilityServiceRender = require('./facility-service-render/facility-service-render.service.js');
const family = require('./family/family.service.js');
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
  app.configure(smsSenders);
  app.configure(saveFacility);
  app.configure(savePerson);
  app.configure(employees);
  app.configure(appointments);
  app.configure(categoryTypes);
  app.configure(resendToken);
  app.configure(joinFacilityChannel);
  app.configure(serviceTags);
  app.configure(products);
  app.configure(billings);
  app.configure(invoices);
  app.configure(organisationServices);
  app.configure(inPatients);
  app.configure(inpatientTransferStatuses);
  app.configure(inpatientWaitingLists);
  app.configure(inpatientWaitingTypes);
  app.configure(vitaLocations);
  app.configure(vitalPositions);
  app.configure(vitalRythms);
  app.configure(forms);
  app.configure(formScopeLevels);
  app.configure(formTypes);
  app.configure(orderMgtTemplates);
  app.configure(facilityPrices);
  app.configure(diagnosises);
  app.configure(laboratoryRequests);
  app.configure(laboratoryReports);
  app.configure(documentations);
  app.configure(symptoms);
  app.configure(stores);
  app.configure(storeRequisitions);
  app.configure(inventoryTransactionTypes);
  app.configure(inventoryTransfers);
  app.configure(investigations);
  app.configure(investigationReportTypes);
  app.configure(purchaseEntries);
  app.configure(inventories);
  app.configure(purchaseOrders);
  app.configure(professions);
  app.configure(assignEmployeeUnit);
  app.configure(prescriptions);
  app.configure(prescriptionPriorities);
  app.configure(presentations);
  app.configure(productRoutes);
  app.configure(productTypes);
  app.configure(productVariants);
  app.configure(assignWorkspace);
  app.configure(workspaces);
  app.configure(appointmentTypes);
  app.configure(auditTray);
  app.configure(bedTypes);
  app.configure(clientTypes);
  app.configure(companycovers);
  app.configure(companycovercategories);
  app.configure(companyHealthCover);
  app.configure(consultingRoom);
  app.configure(corperateFacility);
  app.configure(dictionary);
  app.configure(dischargeType);
  app.configure(dispense);
  app.configure(dispenseAssessment);
  app.configure(docUpload);
  app.configure(drugStrength);
  app.configure(externalPrescription);
  app.configure(facilityAccessControl);
  app.configure(feature);
  app.configure(facilityServiceRender);
  app.configure(family);
};
