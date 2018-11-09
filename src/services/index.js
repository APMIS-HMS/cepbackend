const users = require('./users/users.service.js');
const facilityModules =
  require('./facility-modules/facility-modules.service.js');
const facilityOwnerships =
  require('./facility-ownerships/facility-ownerships.service.js');
const facilityTypes = require('./facility-types/facility-types.service.js');
const facilityClasses =
  require('./facility-classes/facility-classes.service.js');
const titles = require('./titles/titles.service.js');
const locations = require('./locations/locations.service.js');
const relationships = require('./relationships/relationships.service.js');
const genders = require('./genders/genders.service.js');
const maritalStatuses =
  require('./marital-statuses/marital-statuses.service.js');
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
const joinFacilityChannel =
  require('./join-facility-channel/join-facility-channel.service.js');
const serviceTags = require('./service-tags/service-tags.service.js');
const products = require('./products/products.service.js');
const billings = require('./billings/billings.service.js');
const invoices = require('./invoices/invoices.service.js');
const organisationServices =
  require('./organisation-services/organisation-services.service.js');
const inPatients = require('./in-patients/in-patients.service.js');
const inpatientTransferStatuses = require(
    './inpatient-transfer-statuses/inpatient-transfer-statuses.service.js');
const inpatientWaitingLists =
  require('./inpatient-waiting-lists/inpatient-waiting-lists.service.js');
const inpatientWaitingTypes =
  require('./inpatient-waiting-types/inpatient-waiting-types.service.js');
const vitaLocations = require('./vita-locations/vita-locations.service.js');
const vitalPositions = require('./vital-positions/vital-positions.service.js');
const vitalRythms = require('./vital-rythms/vital-rythms.service.js');
const forms = require('./forms/forms.service.js');
const formScopeLevels =
  require('./form-scope-levels/form-scope-levels.service.js');
const formTypes = require('./form-types/form-types.service.js');
const orderMgtTemplates =
  require('./order-mgt-templates/order-mgt-templates.service.js');
const facilityPrices = require('./facility-prices/facility-prices.service.js');
const diagnosises = require('./diagnosises/diagnosises.service.js');
const laboratoryRequests =
  require('./laboratory-requests/laboratory-requests.service.js');
const laboratoryReports =
  require('./laboratory-reports/laboratory-reports.service.js');
const documentations = require('./documentations/documentations.service.js');
const symptoms = require('./symptoms/symptoms.service.js');
const stores = require('./stores/stores.service.js');
const storeRequisitions =
  require('./store-requisitions/store-requisitions.service.js');
const inventoryTransactionTypes = require(
    './inventory-transaction-types/inventory-transaction-types.service.js');
const inventoryTransfers =
  require('./inventory-transfers/inventory-transfers.service.js');
const investigations = require('./investigations/investigations.service.js');
const investigationReportTypes = require(
    './investigation-report-types/investigation-report-types.service.js');
const purchaseEntries =
  require('./purchase-entries/purchase-entries.service.js');
const inventories = require('./inventories/inventories.service.js');
const purchaseOrders = require('./purchase-orders/purchase-orders.service.js');
const professions = require('./professions/professions.service.js');
const assignEmployeeUnit =
  require('./assign-employee-unit/assign-employee-unit.service.js');
const prescriptions = require('./prescriptions/prescriptions.service.js');
const prescriptionPriorities =
  require('./prescription-priorities/prescription-priorities.service.js');
const presentations = require('./presentations/presentations.service.js');
const productRoutes = require('./product-routes/product-routes.service.js');
const productTypes = require('./product-types/product-types.service.js');
const productVariants =
  require('./product-variants/product-variants.service.js');
const assignWorkspace =
  require('./assign-workspace/assign-workspace.service.js');
const workspaces = require('./workspaces/workspaces.service.js');
const auditTray = require('./audit-tray/audit-tray.service.js');
const bedTypes = require('./bed-types/bed-types.service.js');
const clientTypes = require('./client-types/client-types.service.js');
const companycovers = require('./companycovers/companycovers.service.js');
const companycovercategories =
  require('./companycovercategories/companycovercategories.service.js');
const companyHealthCover =
  require('./company-health-cover/company-health-cover.service.js');
const consultingRoom = require('./consulting-room/consulting-room.service.js');
const corperateFacility =
  require('./corperate-facility/corperate-facility.service.js');
const dictionary = require('./dictionary/dictionary.service.js');
const dischargeType = require('./discharge-type/discharge-type.service.js');
const dispense = require('./dispense/dispense.service.js');
const dispenseAssessment =
  require('./dispense-assessment/dispense-assessment.service.js');
const docUpload = require('./doc-upload/doc-upload.service.js');
const externalPrescription =
  require('./external-prescription/external-prescription.service.js');
const facilityAccessControl =
  require('./facility-access-control/facility-access-control.service.js');
const feature = require('./feature/feature.service.js');
const changePassword = require('./change-password/change-password.service.js');
const facilityServiceRender =
  require('./facility-service-render/facility-service-render.service.js');
const family = require('./family/family.service.js');
const familyHealthCover =
  require('./family-health-cover/family-health-cover.service.js');
const fluid = require('./fluid/fluid.service.js');
const frequency = require('./frequency/frequency.service.js');
const genericName = require('./generic-name/generic-name.service.js');
const globalService = require('./global-service/global-service.service.js');
const addNetworks = require('./add-networks/add-networks.service.js');
const passwordReset = require('./password-reset/password-reset.service.js');
const hmos = require('./hmos/hmos.service.js');
const tagDictioneries =
  require('./tag-dictioneries/tag-dictioneries.service.js');
const searchTags = require('./search-tags/search-tags.service.js');
const uploadExcel = require('./upload-excel/upload-excel.service.js');
const familyBeneficiaries =
  require('./family-beneficiaries/family-beneficiaries.service.js');
const searchNetworkFacilities =
  require('./search-network-facilities/search-network-facilities.service.js');
const generateUser = require('./generate-user/generate-user.service.js');
const pendingBills = require('./pending-bills/pending-bills.service.js');
const todayInvoices = require('./today-invoices/today-invoices.service.js');
const locSummaryCashes =
  require('./loc-summary-cashes/loc-summary-cashes.service.js');
const makePayments = require('./make-payments/make-payments.service.js');
const fundWallet = require('./fund-wallet/fund-wallet.service.js');
const joinNetwork = require('./join-network/join-network.service.js');
const securityQuestion =
  require('./security-question/security-question.service.js');
const searchPeople = require('./search-people/search-people.service.js');
const facilityServiceItems =
  require('./facility-service-items/facility-service-items.service.js');
const billFacilityServices =
  require('./bill-facility-services/bill-facility-services.service.js');
const drugGenericList =
  require('./drug-generic-list/drug-generic-list.service.js');
const payments = require('./payments/payments.service.js');
const uploadFacade = require('./upload-facade/upload-facade.service.js');
const facilityRoles = require('./facility-roles/facility-roles.service.js');
const saveEmployee = require('./save-employee/save-employee.service.js');
const scheduleTypes = require('./schedule-types/schedule-types.service.js');
const schedules = require('./schedules/schedules.service.js');
const getPrescription =
  require('./get-prescription/get-prescription.service.js');
const timezones = require('./timezones/timezones.service.js');
const billManagers = require('./bill-managers/bill-managers.service.js');
const customFacilityModules =
  require('./custom-facility-modules/custom-facility-modules.service.js');
const appointmentTypes =
  require('./appointment-types/appointment-types.service.js');
const orderstatus = require('./orderstatus/orderstatus.service.js');
const wardSetup = require('./ward-setup/ward-setup.service.js');
const wardroomgroups = require('./wardroomgroups/wardroomgroups.service.js');
const wardRoomPrices =
  require('./ward-room-prices/ward-room-prices.service.js');
const saveAppointment =
  require('./save-appointment/save-appointment.service.js');
const authorizePrescription =
  require('./authorize-prescription/authorize-prescription.service.js');
const admitPatient = require('./admit-patient/admit-patient.service.js');
const investigationSpecimens =
  require('./investigation-specimens/investigation-specimens.service.js');
const documentationTemplates =
  require('./documentation-templates/documentation-templates.service.js');
const severity = require('./severity/severity.service.js');
const insuranceEnrollees =
  require('./insurance-enrollees/insurance-enrollees.service.js');
const familyDependants =
  require('./family-dependants/family-dependants.service.js');
const vitals = require('./vitals/vitals.service.js');
const listOfStores = require('./list-of-stores/list-of-stores.service.js');
const associations = require('./associations/associations.service.js');
const drugDetailsApis =
  require('./drug-details-apis/drug-details-apis.service.js');
const listOfProducts =
  require('./list-of-products/list-of-products.service.js');
const suppliers = require('./suppliers/suppliers.service.js');
const employeeCheckins =
  require('./employee-checkins/employee-checkins.service.js');
const inventoryInitialisers =
  require('./inventory-initialisers/inventory-initialisers.service.js');
const listOfInventories =
  require('./list-of-inventories/list-of-inventories.service.js');
const inventoryTransferStatuses = require(
    './inventory-transfer-statuses/inventory-transfer-statuses.service.js');
const stockTransfers = require('./stock-transfers/stock-transfers.service.js');
const listOfStockTransfers =
  require('./list-of-stock-transfers/list-of-stock-transfers.service.js');
const drugStrengths = require('./drug-strengths/drug-strengths.service.js');
const listOfPurchaseOrders =
  require('./list-of-purchase-orders/list-of-purchase-orders.service.js');
const priceModifiers = require('./price-modifiers/price-modifiers.service.js');
const makePurchaseEntries =
  require('./make-purchase-entries/make-purchase-entries.service.js');
const workbenches = require('./workbenches/workbenches.service.js');
const getWorkbenches = require('./get-workbenches/get-workbenches.service.js');
const crudInvestigation =
  require('./crud-investigation/crud-investigation.service.js');
const patientSearch = require('./patient-search/patient-search.service.js');
const crudLabRequest =
  require('./crud-lab-request/crud-lab-request.service.js');
const templates = require('./templates/templates.service.js');
const crudLabReport = require('./crud-lab-report/crud-lab-report.service.js');
const bedOccupancy = require('./bed-occupancy/bed-occupancy.service.js');
const getBedOccupancy =
  require('./get-bed-occupancy/get-bed-occupancy.service.js');
const purchaseInvoices =
  require('./purchase-invoices/purchase-invoices.service.js');
const dispensePrescriptions =
  require('./dispense-prescriptions/dispense-prescriptions.service.js');
const patientfluids = require('./patientfluids/patientfluids.service.js');
const searchProcedure =
  require('./search-procedure/search-procedure.service.js');
const treatmentSheets =
  require('./treatment-sheets/treatment-sheets.service.js');
const billCreators = require('./bill-creators/bill-creators.service.js');
const addAddendum = require('./add-addendum/add-addendum.service.js');
const uploadDoc = require('./upload-doc/upload-doc.service.js');
const manufacturers = require('./manufacturers/manufacturers.service.js');
const genericnames = require('./genericnames/genericnames.service.js');
const productPackSizes =
  require('./product-pack-sizes/product-pack-sizes.service.js');
const productConfigs = require('./product-configs/product-configs.service.js');
const supplierService =
  require('./supplier-service/supplier-service.service.js');
const searchSuppliers =
  require('./search-suppliers/search-suppliers.service.js');
const suggestPatientTags =
  require('./suggest-patient-tags/suggest-patient-tags.service.js');
const storeStatistics =
  require('./store-statistics/store-statistics.service.js');
const productReorder = require('./product-reorder/product-reorder.service.js');
const productUniqueReorders =
  require('./product-unique-reorders/product-unique-reorders.service.js');
const cashPayment = require('./cash-payment/cash-payment.service.js');
const dbPatientids = require('./db-patientids/db-patientids.service.js');
const listOfInvoices =
  require('./list-of-invoices/list-of-invoices.service.js');
const bulkPatientUpload =
  require('./bulk-patient-upload/bulk-patient-upload.service.js');
const billSummaryData =
  require('./bill-summary-data/bill-summary-data.service.js');
const paymentChartData =
  require('./payment-chart-data/payment-chart-data.service.js');
const employeeSearch = require('./employee-search/employee-search.service.js');
const addPurchaseEntries =
  require('./add-purchase-entries/add-purchase-entries.service.js');
const formularyProducts =
  require('./formulary-products/formulary-products.service.js');
const getServerTime = require('./get-server-time/get-server-time.service.js');
const vitalBpLocations =
  require('./vital-bp-locations/vital-bp-locations.service.js');
const immunizationSchedule =
  require('./immunization-schedule/immunization-schedule.service.js');
const crudImmunizationSchedule = require(
    './crud-immunization-schedule/crud-immunization-schedule.service.js');
const setMultipleAppointments =
  require('./set-multiple-appointments/set-multiple-appointments.service.js');
const billPrescription =
  require('./bill-prescription/bill-prescription.service.js');
const immunizationRecords =
  require('./immunization-records/immunization-records.service.js');
const crudImmunizationRecord =
  require('./crud-immunization-record/crud-immunization-record.service.js');
const facilityPlans = require('./facility-plans/facility-plans.service.js');
const apmisSubscriptions =
  require('./apmis-subscriptions/apmis-subscriptions.service.js');
const walkinDispensePrescription = require(
    './walkin-dispense-prescription/walkin-dispense-prescription.service.js');
const documentationAuthorization = require(
    './documentation-authorization/documentation-authorization.service.js');
const nhisResports = require('./nhis-resports/nhis-resports.service.js');
const crudLabInvestigationPrice = require('./crud-lab-investigation-price/crud-lab-investigation-price.service.js');
const temporalChanelNames = require('./temporal-chanel-names/temporal-chanel-names.service.js');
const communicate = require('./communicate/communicate.service.js');
const communication = require('./communication/communication.service.js');
const message = require('./message/message.service.js');
const chat = require('./chat/chat.service.js');
const zoomMeeting = require('./zoom-meeting/zoom-meeting.service.js');
const nhisReports = require('./nhis-reports/nhis-reports.service.js');
const uploadExcelPatients = require('./upload-excel-patients/upload-excel-patients.service.js');
const getPatientAppointments = require('./get-patient-appointments/get-patient-appointments.service.js');
const adminDashboardChart = require('./admin-dashboard-chart/admin-dashboard-chart.service.js');
const getPersonPrescriptions = require('./get-person-prescriptions/get-person-prescriptions.service.js');
const inventorySummaryCounts = require('./inventory-summary-counts/inventory-summary-counts.service.js');
const clinicCharts = require('./clinic-charts/clinic-charts.service.js');
const drugInteractions = require('./drug-interactions/drug-interactions.service.js');
// const salesQtiesStatistics = require('./sales-qties-statistics/sales-qties-statistics.service.js');
const batchTransactions = require('./batch-transactions/batch-transactions.service.js');
const inventoryCountDetails = require('./inventory-count-details/inventory-count-details.service.js');
const inventoryExpiredProductDetails = require('./inventory-expired-product-details/inventory-expired-product-details.service.js');
const inventoryAboutToExpireProductDetails = require('./inventory-about-to-expire-product-details/inventory-about-to-expire-product-details.service.js');
const inventoryBatchTransactionDetails = require('./inventory-batch-transaction-details/inventory-batch-transaction-details.service.js');
const fileUploadFacade = require('./file-upload-facade/file-upload-facade.service.js');
const azureBlob = require('./azure-blob/azure-blob.service.js');
const getPersonLabRequest = require('./get-person-lab-requests/get-person-lab-requests.service.js');
const dailyOpd = require('./daily-opd/daily-opd.service.js');
const outOfStockCountDetails = require('./out-of-stock-count-details/out-of-stock-count-details.service.js');
const healthCoveredBillHistories = require('./health-covered-bill-histories/health-covered-bill-histories.service.js');
const addHmoFacilities = require('./add-hmo-facilities/add-hmo-facilities.service.js');
const setTreatmentSheetBills = require('./set-treatment-sheet-bills/set-treatment-sheet-bills.service.js');
const extractFacilityData = require('./extract-facility-data/extract-facility-data.service.js');
const dashboard = require('./dashboard/dashboard.service.js');
const clinicAttendanceSummary = require('./clinic-attendance-summary/clinic-attendance-summary.service.js');
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
  app.configure(externalPrescription);
  app.configure(facilityAccessControl);
  app.configure(feature);
  app.configure(changePassword);
  app.configure(facilityServiceRender);
  app.configure(family);
  app.configure(familyHealthCover);
  app.configure(fluid);
  app.configure(frequency);
  app.configure(genericName);
  app.configure(globalService);
  app.configure(addNetworks);
  app.configure(passwordReset);
  app.configure(hmos);
  app.configure(tagDictioneries);
  app.configure(searchTags);
  app.configure(uploadExcel);
  app.configure(familyBeneficiaries);
  app.configure(searchNetworkFacilities);
  app.configure(generateUser);
  app.configure(pendingBills);
  app.configure(todayInvoices);
  app.configure(locSummaryCashes);
  app.configure(makePayments);
  app.configure(fundWallet);
  app.configure(joinNetwork);
  app.configure(securityQuestion);
  app.configure(searchPeople);
  app.configure(facilityServiceItems);
  app.configure(billFacilityServices);
  app.configure(drugGenericList);
  app.configure(payments);
  app.configure(uploadFacade);
  app.configure(facilityRoles);
  app.configure(saveEmployee);
  app.configure(scheduleTypes);
  app.configure(schedules);
  app.configure(timezones);
  app.configure(billManagers);
  app.configure(customFacilityModules);
  app.configure(appointmentTypes);
  app.configure(orderstatus);
  app.configure(wardSetup);
  app.configure(wardroomgroups);
  app.configure(wardRoomPrices);
  app.configure(saveAppointment);
  app.configure(authorizePrescription);
  app.configure(admitPatient);
  app.configure(investigationSpecimens);
  app.configure(documentationTemplates);
  app.configure(severity);
  app.configure(insuranceEnrollees);
  app.configure(familyDependants);
  app.configure(vitals);
  app.configure(listOfStores);
  app.configure(drugDetailsApis);
  app.configure(listOfProducts);
  app.configure(suppliers);
  app.configure(employeeCheckins);
  app.configure(inventoryInitialisers);
  app.configure(listOfInventories);
  app.configure(inventoryTransferStatuses);
  app.configure(stockTransfers);
  app.configure(listOfStockTransfers);
  app.configure(drugStrengths);
  app.configure(listOfPurchaseOrders);
  app.configure(priceModifiers);
  app.configure(makePurchaseEntries);
  app.configure(associations);
  app.configure(getPrescription);
  app.configure(crudLabReport);
  app.configure(bedOccupancy);
  app.configure(workbenches);
  app.configure(crudInvestigation);
  app.configure(getWorkbenches);
  app.configure(patientSearch);
  app.configure(crudLabRequest);
  app.configure(templates);
  app.configure(getBedOccupancy);
  app.configure(purchaseInvoices);
  app.configure(dispensePrescriptions);
  app.configure(patientfluids);
  app.configure(searchProcedure);
  app.configure(treatmentSheets);
  app.configure(billCreators);
  app.configure(addAddendum);
  app.configure(uploadDoc);
  app.configure(manufacturers);
  app.configure(genericnames);
  app.configure(productPackSizes);
  app.configure(productConfigs);
  app.configure(supplierService);
  app.configure(searchSuppliers);
  app.configure(suggestPatientTags);
  app.configure(storeStatistics);
  app.configure(productReorder);
  app.configure(productUniqueReorders);
  app.configure(cashPayment);
  app.configure(dbPatientids);
  app.configure(listOfInvoices);
  app.configure(bulkPatientUpload);
  app.configure(billSummaryData);
  app.configure(paymentChartData);
  app.configure(employeeSearch);
  app.configure(addPurchaseEntries);
  app.configure(formularyProducts);
  app.configure(getServerTime);
  app.configure(vitalBpLocations);
  app.configure(immunizationSchedule);
  app.configure(crudImmunizationSchedule);
  app.configure(setMultipleAppointments);
  app.configure(billPrescription);
  app.configure(immunizationRecords);
  app.configure(crudImmunizationRecord);
  app.configure(facilityPlans);
  app.configure(apmisSubscriptions);
  app.configure(walkinDispensePrescription);
  app.configure(documentationAuthorization);
  app.configure(nhisResports);
  app.configure(crudLabInvestigationPrice);
  app.configure(temporalChanelNames);
  app.configure(communicate);
  app.configure(communication);
  app.configure(message);
  app.configure(chat);
  app.configure(zoomMeeting);
  app.configure(nhisReports);
  app.configure(uploadExcelPatients);
  app.configure(getPatientAppointments);
  app.configure(adminDashboardChart);
  app.configure(getPersonPrescriptions);
  app.configure(clinicCharts);
  app.configure(drugInteractions);
  app.configure(inventorySummaryCounts);
  app.configure(inventoryCountDetails);
  app.configure(inventoryExpiredProductDetails);
  app.configure(inventoryAboutToExpireProductDetails);
  app.configure(inventoryBatchTransactionDetails);
  //   app.configure(salesQtiesStatistics);
  app.configure(batchTransactions);
  app.configure(fileUploadFacade);
  app.configure(azureBlob);
  app.configure(getPersonLabRequest);
  app.configure(dailyOpd);
  app.configure(outOfStockCountDetails);
  app.configure(healthCoveredBillHistories);
  app.configure(addHmoFacilities);
  app.configure(dashboard);
  app.configure(clinicAttendanceSummary);
};