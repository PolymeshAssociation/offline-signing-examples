const { methods, constructSerializedTx } = require('../utils');

/**
 * Transfer funds from one address to another with a message (memo) attached
 * 
 * @param {string} privateKey - private key of the origin address
 * @param {string} dest - destination address
 * @param {string} value - amount to be transferred (we use numeric strings to support larger numbers)
 * @param {string | undefined} memo - message to attach to the transfer. Max 32 characters. Can be left empty for no message
 * 
 * @returns {string} serialized tx
 */
function transferWithMemo(privateKey, dest, value, memo) {      
  return constructSerializedTx(privateKey, methods.balances.transferWithMemo, {
    value,
    dest,
    memo: memo ? memo.padEnd(32, '\0') : null,
  });
}

module.exports = {
  transferWithMemo
};
