// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html


function randamApha() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = 0; i < 2; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function OrderId() {
  var number = Math.floor(Math.random() * 9999999) + 1;
  if (number.length < 7) {
    number = String('0000000' + number).slice(-7);
  }
  var retVal = 'PO' + number + '' + randamApha();
  return retVal;
}

function ListId() {
  var number = Math.floor(Math.random() * 9999999) + 1;
  if (number.length < 7) {
    number = String('0000000' + number).slice(-7);
  }
  var retVal = 'LO' + number + '' + randamApha();
  return retVal;
}

async function generateUniqueOrderNumber(v) {
  const purchaseOrder = v.app.service('purchase-orders');
  let orderNo = OrderId();
  const purchaseOrderReturn = await purchaseOrder.find({
    query: {
      facilityId: v.data.facilityId,
      purchaseOrderNumber: orderNo
    }
  });
  if (purchaseOrderReturn.data.length == 0) {
    v.data.purchaseOrderNumber = orderNo;
  } else {
    return generateUniqueOrderNumber(v);
  }

}

async function generateUniqueListNumber(v) {
  const purchaseList = v.app.service('purchase-list');
  let ListNo = ListId();
  const purchaseListReturn = await purchaseList.find({
    query: {
      facilityId: v.data.facilityId,
      purchaseListNumber: ListNo
    }
  });
  if (purchaseListReturn.data.length == 0) {
    v.data.purchaseListNumber = ListNo;
  } else {
    return generateUniqueListNumber(v);
  }

}


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    if (context.data.purchaseOrderNumber !== undefined) {
      return generateUniqueOrderNumber(context);
    } else if (context.data.purchaseListNumber !== undefined) {
      return generateUniqueListNumber(context);
    }

  };
};
