const { getPolkadotApi } = require('../utils');


/**
 * Check if an address has an associated Identity with a valid CDD claim
 * 
 * @param {string} userAddress - address of the user for whom to check Identity and status
 * 
 * @returns {{ did: string | undefined; hasCddClaim: boolean }} - DID string (undefined if the address isn't part of an Identity) and CDD status (true: valid CDD claim, false: invalid/expired/nonexistent CDD claim)
 */
async function getIdentityStatus(userAddress) {
  const api = await getPolkadotApi(); 

  const did = await api.query.identity.keyToIdentityIds(userAddress);

  if (did.isEmpty) {
    return {
      did: undefined,
      hasCddClaim: false,
    };
  }

  const cddResponse = await api.rpc.identity.isIdentityHasValidCdd(did);

  const hasCddClaim = cddResponse.isOk;
  const status = hasCddClaim ? 'VALID' : 'INVALID';

  console.log('======================');
  console.log(`Identity "${did}" CDD status: ${status}`);
  console.log('======================');

  return {
    did,
    hasCddClaim,
  };
}

module.exports = {
  getIdentityStatus,
};