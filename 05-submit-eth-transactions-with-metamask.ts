import { MetaMaskWalletProvider, Sdk, randomPrivateKey, NetworkNames, EnvNames } from 'etherspot';

/**
 * Example code to create smart wallet on kovan testnet using etherspot sdk
 * the generated smart wallet is not deployed on chain until the first transaction.
 */


  if (!MetaMaskWalletProvider.detect()) {
    console.log('MetaMask not detected');
    return;
  }


var batchHash: string = 'xxx';

async function main(): Promise<void> {
  const walletProvider = await MetaMaskWalletProvider.connect();
  const sdk = new Sdk(walletProvider, {
    env: EnvNames.TestNets, // Use EnvNames.Mainnet, If you are accessing Mainnets
    networkName: NetworkNames.Ropsten, // actually it keep using network on metamask not this one.
  });

  const { state } = sdk;

  console.log('create session', await sdk.createSession());
  await sdk.computeContractAccount({sync: true});
  console.log('Smart wallet', state.account);
  console.log('Account balances ', await sdk.getAccountBalances());

  const receiver = '0x940d89BFAB20d0eFd076399b6954cCc42Acd8e15'; // Replace with address of your choice

  const amtInWei = '500000000000000000'; //Send 0.5 ETH
  //this method will add the transaction to a batch, which has to be executed later.

// step 1 - create the transaction and add to the batch queue
  const transaction = await sdk.batchExecuteAccountTransaction({
    to: receiver,//wallet address
    value: amtInWei,//in wei
  });

// step 1.1 - you can add more transations as above step 1, before you estimate gas price and submit the whole batch.

  console.log('Estimating transaction');

// step 2 - estimate gas price for the whole batch queue
  await sdk.estimateGatewayBatch().then(async (result) => {
    console.log('Estimation ', result.estimation);

    // step 3 - if there is an estimated gas receive, then you can start to submit the whole batch.
    batchHash = (await sdk.submitGatewayBatch()).hash;
    console.log('Transaction submitted, hash: ', batchHash);
  })
  .catch((error) => {
    console.log('Transaction estimation failed with error ',error.message);
  });

// step 4 - loop and check (or use notification instead) to see the batch submit in process

  console.log('hash', batchHash)
  var xx: string = 'wait'

// step 4.1 you will see Sent if the whole batch is sent.
  while(xx !== 'Sent') {
    await new Promise(r => setTimeout(r, 2000));
    console.log(xx)
    sdk
      .getGatewaySubmittedBatch({
        hash: batchHash,
      }).then(
        (x) => {
          console.log('🙉 batch process: ', x.state)
          xx = x.state;
        }
      )
      .catch(console.error)
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
