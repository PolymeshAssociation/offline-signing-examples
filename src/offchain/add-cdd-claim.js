const { methods, constructSerializedTx } = require('../utils');

/**
 * Adds a Customer Due Diligence claim to an Identity
 * 
 * @param {string} privateKey - private key of the Identity's primary key ("home" address)
 * @param {string} userIdentity - identity ID (DID) of the user that is being onboarded, fetched using `checkAddressCdd`
 * 
 * @returns {string} serialized tx
 */
function addCddClaim(privateKey, userIdentity) {      
  return constructSerializedTx(privateKey, methods.identity.addClaim, {
    target: userIdentity,
    claim: {
      CustomerDueDiligence: '0x'.padEnd(66, '0'),
    },
    expiry: null,
  });
}

module.exports = {
  addCddClaim
};