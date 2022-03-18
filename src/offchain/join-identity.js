const { methods, constructSerializedTx } = require('../utils');

/**
 * Accept an authorization to join an Identity as a secondary key
 * 
 * @param {string} privateKey - private key of the address that will accept the authorization to join the Identity
 * @param {number} authId - identifier of the authorization that was generated via `addSecondaryKey`. Fetched using `getPendingAuthorizations`
 * 
 * @returns {string} serialized tx
 */
function joinIdentity(privateKey, authId) {      
  return constructSerializedTx(privateKey, methods.identity.joinIdentityAsKey, {
    authId,
  });
}

module.exports = {
  joinIdentity
};
