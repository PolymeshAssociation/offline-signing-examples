const onchain = require('./onchain');
const offchain = require('./offchain');
const { submitTx } = require('./utils');

(async () => {

  // See subkey inspect "//Eve"
  let evePrivateKey = '0x786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a';
  // See subkey inspect "//Foo"
  let bobAddress = '5CQ46C1Xn9sLo9WmJFc4bEyAp9KRrudRieRXAQRqazhDWjMT';

  let data = await onchain.getIdentityStatus(bobAddress);

  if (!data.did) { // Register DID
    const registerTx = await offchain.registerIdentity(
      evePrivateKey,
      bobAddress
    );
    
    await submitTx(registerTx);
  }

  const { did } = await onchain.getIdentityStatus(bobAddress);
  
  if (did) {
    const cddTx = await offchain.addCddClaim(evePrivateKey, did);

    await submitTx(cddTx);

    // double check status (the function logs the results)
    await onchain.getIdentityStatus(bobAddress);
  } else {
    throw ("DID Not Registered Correctly");
  }

  await onchain.getPendingAuthorizations(bobAddress);

  const transferTx = await offchain.transferWithMemo(
    evePrivateKey,
    bobAddress,
    "10000000", // this will transfer 10 POLYX
    "INITIAL TRANSFER" // message length max is 32 chars
  );
  await submitTx(transferTx);

})().catch(err => console.error(err));