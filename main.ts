import { Sdk, randomPrivateKey, NetworkNames, EnvNames } from "etherspot";
const { take } = require('rxjs/operators')
const erc20Abi = require('human-standard-token-abi')
const { providers, utils, Wallet, getDefaultProvider } = require("ethers");
const abiCoder = require('web3-eth-abi');

const tokenAddress = '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51'; //sUSD contract on Kovan
const receiver = '0x4e5687738DEcd4b2D3a16c33944686DCE2811399'; // Replace with address of your choice
const privateKey = "0xef60ad624bf7850ffc262995860bfc84485ccf7fbe252faf770960e427f3e5cc" // or randomPrivateKey()
const mnemonic =
  "announce room limb pattern dry unit scale effort smooth jazz weasel alcohol";
const provider = getDefaultProvider("kovan");

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
    const notification = notifications$.pipe(take(1)).toPromise()
    console.log(state.account) // pay 0.1 to this account
  // -------------- etherspot session
  // Create a wallet instance from a mnemonic...
  const walletMnemonic = Wallet.fromMnemonic(mnemonic);
  const wallet = new Wallet(walletMnemonic.privateKey, provider);
  console.log([wallet.address, wallet.publicKey, wallet.privateKey]);
  console.log(await wallet.getBalance());

  const nonce = await wallet.getTransactionCount();
  console.log("Nonce: ", nonce)

  const response = await wallet.sendTransaction({
    to: state.account.address,
    value: utils.parseEther("0.1"),
    nonce,
  });

  await response.wait();
  console.log(await wallet.getBalance());

//  sdk.topUpAccount() // Error: Faucet not supported on current network (kovan)
  // ----------- transfer tokens 
  const tokens = '1000000000000000000'; // 1 sUSD
  const methodName = erc20Abi.find((a:any) => a.name === 'transfer');
  console.log('Method Name ',methodName);
  //encode the transfer method using ethers.js
  const encodedData = abiCoder.encodeFunctionCall(
      methodName,
      [
          receiver,
          tokens
      ]);

  console.log('Encoded function call ',encodedData);
  //this method will add the transaction to a batch, which has to be executed later.
  const transaction = await sdk.batchExecuteAccountTransaction({
    to: receiver,//wallet address
    data: encodedData,
  });

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

  console.log('transactions', transactions);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
