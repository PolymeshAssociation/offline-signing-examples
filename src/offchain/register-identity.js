const { methods, constructSerializedTx } = require('../utils');

/**
 * Associate a user's address to a new Identity. The address must not be previously associated to another
 * Identity
 * 
 * @param {string} privateKey - private key of the Identity's primary key ("home" address)
 * @param {string} userAddress - address of the user that will be onboarded
 * 
 * @returns {string} serialized tx
 */
function registerIdentity(privateKey, userAddress) {      
  return constructSerializedTx(privateKey, methods.identity.cddRegisterDid, {
    targetAccount: userAddress,
    secondaryKeys: [],
});
}

module.exports = {
  registerIdentity
};
