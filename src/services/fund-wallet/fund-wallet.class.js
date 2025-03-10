/* eslint-disable no-unused-vars */
' use strict ';
const walletModel = require('../../custom-models/wallet-model');
const walletTransModel = require('../../custom-models/wallet-transaction-model');
const Client = require('node-rest-client').Client;
const request = require('request');
const requestPromise = require('request-promise');
var crypt = require('crypto-js');
const logger = require('winston');
const rxjs = require('rxjs');
const jsend = require('jsend');

class FundWalletService {
  constructor(options) {
    this.options = options || {};
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
    const facilityService = this.app.service('facilities');
    const employeeService = this.app.service('employees');
    const peopleService = this.app.service('people');
    const paymentService = this.app.service('payments');
    const cashPaymentService = this.app.service('cash-payment');

    const accessToken = params.accessToken !== undefined ? params.accessToken : params.headers.authorization.split(' ')[1]; /* Not required */
    if (accessToken !== undefined && data.paymentMethod === undefined) {
      const ref = data.ref; /* Not required. This is for e-payment */
      const payment = data.payment;
      const paymentType = payment.type; /* Required. This is either "Cash*, "Cheque", "e-Payment" */
      const paymentRoute = payment.route; /* Not required. This is either "Flutterwave", "Paystack" */
      const amount = data.amount; /* Required */
      const facilityId =
        data.facilityId; /* Not required. This is if someone is funding the wallet on behalf of the facility */
      const entity =
        data.entity; /* Required. This is the entity making the transaction. Could either be "Person" or "Facility" */
      const loggedPersonId = params.user.personId;
      const destinationId = data.destinationId !== undefined ? data.destinationId : params.user.personId;
      if (payment !== undefined) {
        const paymentPayload = {
          facilityId: entity === 'Facility' ? facilityId : undefined,
          personId: entity === 'Person' ? destinationId : undefined,
          entity: entity,
          reference: ref,
          paidBy: loggedPersonId,
          amount: amount,
          paymentType: paymentType,
          paymentRoute: paymentRoute
        };
        if (paymentRoute !== undefined && paymentRoute.toLowerCase() === 'flutterwave') {
          //*****Save Payment in database */
          const paymentRes = await paymentService.create(paymentPayload);
          const url = process.env.FLUTTERWAVE_VERIFICATION_URL;
          const verifyResponse = await this.verifyPayment(
            url,
            process.env.FLUTTERWAVE_SECRET_KEY,
            paymentRes.reference.flwRef
          );
          const parsedResponse = JSON.parse(verifyResponse);
          if (parsedResponse.status === 'success') {
            paymentRes.isActive = true;
            paymentRes.paymentResponse = parsedResponse.data;
            // Update payment record.
            const updatedPayment = await paymentService.update(paymentRes._id, paymentRes);

            if (entity !== undefined && entity.toLowerCase() === 'person') {
              const person = await peopleService.get(destinationId);
              const userWallet = person.wallet;
              const cParam = {
                amount: amount,
                paidBy: loggedPersonId,
                sourceId: loggedPersonId,
                sourceType: entity,
                transactionType: 'Cr',
                transactionMedium: paymentType,
                destinationId: destinationId,
                destinationType: entity,
                description: 'Funded wallet via e-payment',
                transactionStatus: 'Completed'
              };
              person.wallet = transaction(userWallet, cParam);

              const personUpdate = await peopleService.update(person._id, person, {
                query: {
                  facilityId: params.query.facilityId
                }
              });

              return jsend.success(personUpdate);
            } else if (entity !== undefined && entity.toLowerCase() === 'facility') {
              const facility = await facilityService.get(facilityId);
              const facilityWallet = await facilityService.get(facilityId, {
                query: {
                  $select: ['wallet']
                }
              });
              const userWallet = facilityWallet.wallet; // facility.wallet;
              const cParam = {
                amount: amount,
                paidBy: loggedPersonId,
                sourceId: facilityId,
                sourceType: entity,
                transactionType: 'Cr',
                transactionMedium: paymentType,
                destinationId: facilityId,
                destinationType: entity,
                description: 'Funded wallet via e-payment',
                transactionStatus: 'Completed'
              };
              facility.wallet = transaction(userWallet, cParam);

              const facilityUpdate = await facilityService.update(facility._id, facility);
              return jsend.success(facilityUpdate);
            }
          } else {
            return new Error('There was an error while verifying this payment');
          }
        } else if (paymentRoute !== undefined && paymentRoute.toLowerCase() === 'paystack') {
          const paymentRes = await paymentService.create(paymentPayload);
          if (paymentRes !== undefined) {
            let url = (data.authorization_code === undefined) ? process.env.PAYSTACK_VERIFICATION_URL + data.ref.trxref : process.env.PAYSTACK_CARD_REUSE_URL;
            let payload = await this.verifyPayStackPayment(url, data);
            if (payload.status && payload.data.status === 'success') {
              const paystackConfirmedAmountInNaira = payload.data.amount / 100;
              paymentRes.isActive = true;
              paymentRes.paymentResponse = payload;
              let updatedPayment = await paymentService.update(paymentRes._id, paymentRes);
              if (updatedPayment !== undefined) {
                if (entity !== undefined && entity.toLowerCase() === 'person') {
                  const person = await peopleService.get(destinationId);
                  const personWallet = await peopleService.get(destinationId, {
                    query: {
                      $select: ['wallet']
                    }
                  });
                  const userWallet = personWallet.wallet;
                  const cParam = {
                    amount: paystackConfirmedAmountInNaira,
                    paidBy: loggedPersonId,
                    sourceId: loggedPersonId,
                    sourceType: entity,
                    transactionType: 'Cr',
                    transactionMedium: paymentType,
                    destinationId: destinationId,
                    destinationType: entity,
                    description: 'Funded wallet via e-payment',
                    transactionStatus: 'Completed'
                  };
                  person.wallet = transaction(userWallet, cParam);
                  if (params.query.isCardReused === 'true') {
                    params.query.isCardReused = true;
                  } else if (params.query.isCardReused === 'false') {
                    params.query.isCardReused = false;
                  }

                  if (params.query.saveCard === 'true') {
                    params.query.saveCard = true;
                  } else if (params.query.saveCard === 'false') {
                    params.query.saveCard = false;
                  }
                  if (!params.query.isCardReused && params.query.saveCard) {
                    const checkUniqueness = person.wallet.cards.filter(x => x.authorization.signature.toString() === payload.data.authorization.signature.toString());
                    if (checkUniqueness.length === 0) {
                      payload.data.authorization.authorization_code = crypt.AES.encrypt(payload.data.authorization.authorization_code, process.env.CARD_AUTHORISATION_KEY).toString();
                      payload.data.customer.email = crypt.AES.encrypt(payload.data.customer.email, process.env.CARD_AUTHORISATION_KEY).toString();
                      person.wallet.cards.push({
                        authorization: payload.data.authorization,
                        customer: payload.data.customer
                      });
                    }
                  }
                  try {
                    const personUpdate = await peopleService.update(person._id, person, {
                      query: {
                        facilityId: params.query.facilityId
                      }
                    });
                    if (data.authorization_code === undefined) {
                      const card_save_status = (payload.data.authorization.reusable) ? true : false;
                      personUpdate.card_save_status = card_save_status;
                    } else if (data.authorization_code !== undefined) {
                      personUpdate.card_auth_status = true;
                    }

                    return jsend.success(personUpdate);
                  } catch (error) {
                    return jsend.error('There was a problem trying to create prescription');
                  }
                } else if (entity !== undefined && entity.toLowerCase() === 'facility') {
                  const facility = await facilityService.get(facilityId);
                  const facilityWallet = await facilityService.get(facilityId, {
                    query: {
                      $select: ['wallet']
                    }
                  });
                  const userWallet = facilityWallet.wallet; //facility.wallet;
                  const cParam = {
                    amount: paystackConfirmedAmountInNaira,
                    paidBy: loggedPersonId,
                    sourceId: facilityId,
                    sourceType: entity,
                    transactionType: 'Cr',
                    transactionMedium: paymentType,
                    destinationId: facilityId,
                    destinationType: entity,
                    description: 'Funded wallet via e-payment',
                    transactionStatus: 'Completed'
                  };
                  facility.wallet = transaction(userWallet, cParam);
                  try {
                    const facilityUpdate = await facilityService.update(facility._id, facility);
                    let selectedFacility = await facilityService.get(facility._id, {
                      query: {
                        $select: ['wallet']
                      }
                    });
                    facilityUpdate.wallet = selectedFacility.wallet;
                    return jsend.success(facilityUpdate);
                  } catch (error) {}
                }
              }
            } else if (payload.status && payload.data.status === 'failed') {
              const _result = {
                status: payload.status,
                card_auth_status: false
              };
              return jsend.success(_result);
            } else {
              const _result = {
                status: false,
                card_auth_status: false,
                card_save_status: false
              };
              return jsend.success(_result);
            }
          }
        }
      } else {
        const data = {
          msg: 'payment parameter is not defined',
          status: false
        };
        return data;
      }
    } else if (
      accessToken !== undefined &&
      (data.paymentMethod !== undefined && data.paymentMethod.toLowerCase() === 'cash')
    ) {
      const person = await peopleService.get(data.destinationId);
      const personWallet = await peopleService.get(data.destinationId, {
        query: {
          $select: ['wallet']
        }
      });
      const userWallet = personWallet.wallet; //person.wallet;
      const cParam = {
        amount: data.amount,
        paidBy: data.paidBy,
        sourceId: data.sourceId,
        sourceType: 'Facility',
        transactionType: 'Cr',
        transactionMedium: 'cash',
        destinationId: data.destinationId,
        destinationType: 'Person',
        description: 'Funded wallet via cash payment',
        transactionStatus: 'Completed'
      };
      person.wallet = transaction(userWallet, cParam, 'person');

      const facility = await facilityService.get(data.sourceId);
      const facilityWallet2 = await facilityService.get(data.sourceId, {
        query: {
          $select: ['wallet']
        }
      });
      const facilityWallet = facilityWallet2.wallet; // facility.wallet;

      const cParamF = {
        amount: data.amount,
        paidBy: data.paidBy,
        sourceId: data.sourceId,
        sourceType: 'Facility',
        transactionType: 'Dr',
        transactionMedium: 'cash',
        destinationId: data.destinationId,
        destinationType: 'Person',
        description: 'Debit wallet via patient wallet transfer',
        transactionStatus: 'Completed'
      };
      facility.wallet = transaction(facilityWallet, cParamF, 'facility');
      // } else if (entity !== undefined && entity.toLowerCase() === 'facility') {
      //     const facility = await facilityService.get(facilityId);
      //     const userWallet = facility.wallet;
      //     const cParam = {
      //         amount: amount,
      //         paidBy: loggedPersonId,
      //         sourceId: facilityId,
      //         sourceType: entity,
      //         transactionType: 'Cr',
      //         transactionMedium: paymentType,
      //         destinationId: facilityId,
      //         destinationType: entity,
      //         description: 'Funded wallet via e-payment',
      //         transactionStatus: 'Completed',
      //     };
      //     facility.wallet = transaction(userWallet, cParam);

      //     const facilityUpdate = await facilityService.update(facility._id, facility);
      //     return jsend.success(facilityUpdate);
      // }
      // const cashPayment = await cashPaymentService.create(data, params);
      // console.log('********Cash Payment from fundwallet**********');
      // console.log(cashPayment);

      let personUpdate = await peopleService.update(person._id, person, {
        query: {
          facilityId: params.query.facilityId
        }
      });
      const personWallet2 = await peopleService.get(data.destinationId, {
        query: {
          $select: ['wallet']
        }
      });
      personUpdate.wallet = personWallet2.wallet;
      //const personUpdate = await peopleService.update(person._id, person);
      const facilityUpdate = await facilityService.patch(facility._id, {
        wallet: facility.wallet
      });
      const facilityWallet3 = await facilityService.get(facility._id, {
        query: {
          $select: ['wallet']
        }
      });
      facilityUpdate.wallet = facilityWallet3.wallet;
      return jsend.success({
        facility: facilityUpdate,
        person: personUpdate
      });
    } else {
      const data = {
        msg: 'Sorry! But you can not perform this transaction.',
        status: false
      };
      return data;
    }
    // });
  }

  verifyPayStackPayment(url, data) {
    if (data.authorization_code !== undefined) {
      let auth = crypt.AES.decrypt(data.authorization_code.toString(), process.env.CARD_AUTHORISATION_KEY).toString(crypt.enc.Utf8);
      let email = crypt.AES.decrypt(data.email.toString(), process.env.CARD_AUTHORISATION_KEY).toString(crypt.enc.Utf8);
      const options = {
        method: 'POST',
        uri: url,
        headers: {
          Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
          'Content-Type': 'application/json'
        },
        body: {
          authorization_code: auth.toString(),
          email: email.toString(),
          amount: data.amount.toString()
        },
        json: true
      };
      return requestPromise(options);
    } else if (data.authorization_code === undefined) {
      const options = {
        method: 'GET',
        uri: url,
        headers: {
          Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY
        },
        json: true
      };
      return requestPromise(options);
    }

  }

  verifyPayment(url, secKey, ref) {
    const options = {
      method: 'POST',
      uri: url,
      body: JSON.stringify({
        SECKEY: secKey, //use the secret key from the paybutton generated on the rave dashboard
        flw_ref: ref, //use the reference of the payment from the rave checkout after payment
        normalize: 1
      }),
      headers: {
        'content-type': 'application/json'
      }
    };
    return requestPromise(options);
  }

  setup(app) {
    this.app = app;
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  //Delete User's Card
  async remove(id, params) {
    const peopleService = this.app.service('people');
    const personWallet = await peopleService.get(id, {
      query: {
        $select: ['wallet']
      }
    });
    const cards = personWallet.wallet.cards.filter(x => x._id.toString() !== params.query.cardId.toString());

    personWallet.wallet.cards = JSON.parse(JSON.stringify(cards));
    const patchedWallet = await peopleService.patch(id, {
      wallet: personWallet.wallet
    }, {});
    const _result = await peopleService.get(patchedWallet._id, {
      query: {
        $select: ['wallet']
      }
    });
    return jsend.success(_result);
  }
}

function transaction(wallet, param, type) {
  if (wallet == null) {
    wallet = {
      balance: 0,
      ledgerBalance: 0,
      transactions: []
    };
  }
  const prevAmount = wallet.balance;
  const ledgerBalance = wallet.ledgerBalance;
  // Update person wallet.
  let transaction = {
    transactionType: param.transactionType,
    transactionMedium: param.transactionMedium,
    transactionStatus: param.transactionStatus,
    sourceId: param.sourceId,
    sourceType: param.sourceType,
    amount: param.amount,
    refCode: generateOtp(),
    description: param.description,
    destinationId: param.destinationId,
    destinationType: param.destinationType,
    paidBy: param.paidBy
  };

  wallet.transactions.push(transaction);
  if (param.transactionMedium === 'cash') {
    if (type === 'person') {
      wallet.balance = parseFloat(wallet.balance) + parseFloat(param.amount);
      wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) + parseFloat(param.amount);
    } else {
      wallet.balance = parseFloat(wallet.balance) - parseFloat(param.amount);
      wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) - parseFloat(param.amount);
    }
  } else {
    wallet.balance = parseFloat(wallet.balance) + parseFloat(param.amount);
    wallet.ledgerBalance = parseFloat(wallet.ledgerBalance) + parseFloat(param.amount);
  }

  const lastTxIndex = wallet.transactions.findIndex((x) => x.refCode === transaction.refCode);
  if (lastTxIndex > -1) {
    let lastTx = wallet.transactions[lastTxIndex];
    lastTx.balance = wallet.balance;
    lastTx.ledgerBalance = wallet.ledgerBalance;
    wallet.transactions[lastTxIndex] = lastTx;
  }
  return wallet;
}

function generateOtp() {
  var otp = '';
  var possible = '0123456789';
  for (var i = 0; i <= 5; i++) {
    otp += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return otp;
}

module.exports = function (options) {
  return new FundWalletService(options);
};

module.exports.Service = FundWalletService;
