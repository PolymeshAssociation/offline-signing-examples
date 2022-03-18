const { methods, constructSerializedTx } = require('../utils');

/**
 * Create an authorization request so an address can join an existing Identity as a secondary key
 * 
 * @param {string} privateKey - private key of the Identity's primary key ("home" address)
 * @param {string} secondaryKey - address that will be added to the Identity
 * 
 * @returns {string} serialized tx
 */
function addSecondaryKey(privateKey, secondaryKey) {      
  return constructSerializedTx(privateKey, methods.identity.addAuthorization, {
    target: { Account: secondaryKey },
    data: {
      JoinIdentity: {
        asset: { These: [] },
        extrinsic: { These: [] },
        portfolio: { These: [] },
      }
    },
    expiry: null,
  });
}

module.exports = {
  addSecondaryKey
};
