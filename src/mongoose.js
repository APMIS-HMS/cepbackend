const mongoose = require('mongoose');
const KeyVault = require('azure-keyvault');
const msRestAzure = require('ms-rest-azure');

module.exports = async function (app) {
  var env = process.env.NODE_ENV || 'dev';
  if (env === 'dev') {
    mongoose.connect(app.get('mongodb'), {
      useMongoClient: true
    });
    mongoose.Promise = global.Promise;
    app.set('mongooseClient', mongoose);
  } else {
    mongoose.Promise = global.Promise;
    app.set('mongooseClient', mongoose);

    try {
      const credentials = await msRestAzure.loginWithServicePrincipalSecret(process.env.CLIENT_ID, process.env.SECRET, process.env.DOMAIN);
      const keyVaultClient = new KeyVault.KeyVaultClient(credentials);
      var vaultUri = process.env.APMIS_KEY_VAULT; //'https://' + 'apmiskeyvault' + '.vault.azure.net/';
      const key = await keyVaultClient.getSecret(vaultUri, process.env.TEST_API_SECRET_NAME, '');

      mongoose.connect(key.value, {
        useMongoClient: true
      });
    } catch (error) {
      console.log('Error getting connection info');
    }

  }

};
