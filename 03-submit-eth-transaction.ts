import { Sdk, randomPrivateKey, NetworkNames, EnvNames } from 'etherspot';

/**
 * Example code to create smart wallet on kovan testnet using etherspot sdk
 * the generated smart wallet is not deployed on chain until the first transaction.
 */

const privateKey = "0x398dd483a53fef9b5b37c142bdbabcef69a9b5e133885ffb62981f6484ee7aa1"

async function main(): Promise<void> {
  const sdk = new Sdk(privateKey, {
    env: EnvNames.TestNets, // Use EnvNames.Mainnet, If you are accessing Mainnets
    networkName: NetworkNames.Ropsten,
    //projectKey: 'test-project', //optional can be used to uniquely identify your project
  });

  const { state } = sdk;

  console.log('create session', await sdk.createSession());
  await sdk.computeContractAccount({sync: true});
  console.log('Smart wallet', state.account);
  console.log('Account balances ', await sdk.getAccountBalances());

  const receiver = '0x940d89BFAB20d0eFd076399b6954cCc42Acd8e15'; // Replace with address of your choice
  const amtInWei = '500000000000000000'; //Send 0.5 ETH
  //this method will add the transaction to a batch, which has to be executed later.
  const transaction = await sdk.batchExecuteAccountTransaction({
    to: receiver,//wallet address
    value: amtInWei,//in wei
  });

  console.log('Estimating transaction');
  await sdk.estimateGatewayBatch().then(async (result) => {
    console.log('Estimation ', result.estimation);
    const hash = await sdk.submitGatewayBatch();
    console.log('Transaction submitted ', hash);
  })
  .catch((error) => {
    console.log('Transaction estimation failed with error ',error.message);
  });
}

main()
  .catch(console.error)
  .finally(() => process.exit());
