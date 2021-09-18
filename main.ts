import { Sdk, randomPrivateKey, NetworkNames, EnvNames } from "etherspot";
const { take } = require('rxjs/operators')
const erc20Abi = require('human-standard-token-abi')
const { utils, Wallet, getDefaultProvider } = require("ethers");
const abiCoder = require('web3-eth-abi');

const tokenAddress = '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51'; //sUSD contract on Kovan
const receiver = '0x4e5687738DEcd4b2D3a16c33944686DCE2811399'; // Replace with address of your choice

const privateKey = "0xef60ad624bf7850ffc262995860bfc84485ccf7fbe252faf770960e427f3e5cc" // to use your own test account 
// account address is 0xf3e06eeC1A90A7aEB10F768B924351A0F0158A1A

async function main(): Promise<void> {
  // -------------- etherspot session
  const sdk = new Sdk(privateKey
, {
    env: EnvNames.TestNets, // Use EnvNames.Mainnet, If you are accessing Mainnets
    networkName: NetworkNames.Kovan,
    //projectKey: 'test-project', //optional can be used to uniquely identify your project
  });
console.log('create session', await sdk.createSession())
    await sdk.computeContractAccount({sync: true})
    const { state, notifications$ } = sdk
sdk.notifications$.subscribe(notification => console.log('notification:', notification));
//    const notification = notifications$.pipe(take(1)).toPromise()
    console.log(state.account) // pay 0.1 to this account

  const amtInWei = '500000000000000000'; //Send 0.5 ETH
  
  console.log('transaction',
  await sdk.batchExecuteAccountTransaction({
    to: receiver,//wallet address
    value: amtInWei,//in wei
  })
  )

  console.log('Estimating transaction');
  await sdk.estimateGatewayBatch().then(async (result) => {
    console.log('Estimation ', result.estimation);
    const hash = await sdk.submitGatewayBatch();
    console.log('Transaction submitted ', hash);
  })
  .catch((error) => {
    console.log('Transaction estimation failed with error ',error);
  });
 const account = '0x029D23a459a861592821622F1F5779dcb17419BD'
 const transactions = await sdk.getTransactions({ account });

  //console.log('transactions', transactions);
  console.log('total transactions', transactions.items.length)
  console.log('🐯------------------ the end of the execution -----🐯')
}

main()
  .catch(console.error)
  .finally(() => process.exit());
