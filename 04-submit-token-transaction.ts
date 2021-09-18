import {
  ContractNames,
  getContractAbi,
} from '@etherspot/contracts';

import { Sdk, NetworkNames, EnvNames } from 'etherspot';
const erc20Abi = getContractAbi(ContractNames.ERC20Token)
const abiCoder = require('web3-eth-abi');
const ethers = require('ethers')
var batchHash: string = 'xxx';
/**
 * Example code to create smart wallet on Ropsten testnet using etherspot sdk
 * the generated smart wallet is not deployed on chain until the first transaction.
 */
const privateKey = '0x398dd483a53fef9b5b37c142bdbabcef69a9b5e133885ffb62981f6484ee7aa1'

async function main(): Promise<void> {
  console.log('🐯 start this program 🙊')
  const sdk = new Sdk(privateKey, {
    env: EnvNames.TestNets, // Use EnvNames.Mainnet, If you are accessing Mainnets
    networkName: NetworkNames.Ropsten,
    //projectKey: 'test-project', //optional can be used to uniquely identify your project
  });

  sdk.notifications$.subscribe(console.log);
  const { state } = sdk;

  console.log('create session', await sdk.createSession());
  await sdk.computeContractAccount({ sync: true });
  console.log('Smart wallet', state.account);
  console.log('Account balances ', (await sdk.getAccountBalances()).items[0]);

  const bal = (await sdk.getAccountBalances()).items[0].balance.toString()
  console.log('Balance ETHs', ethers.utils.formatEther(bal))

  const receiver = '0x5842d94A698d625857993859ac5b380dC3e5C3eA'; // Replace with address of your choice
  const erc20Address = '0xbe49ac1eadac65dccf204d4df81d650b50122ab2'; //fUSDC contract on Ropsten
  //const erc20Address = '0x9de9cde889a40b7402d824386064d17792298e1b'; //PLR contract on Kovan
  const tokens = '8000000000000000000'; // 8 tokens with 18 decimal
// you need to use https://ropsten.etherscan.io/address/0xbe49ac1eadac65dccf204d4df81d650b50122ab2#writeContract transferFrom to get your own fUSDC tokens finally. (from Smart Wallet Contract respected to sdk account, 0xBF4f2D1Fdaf898DF5D9a53a9a5019856DB88Aa1B, where you can refer to console.log in line 30

  const methodName = erc20Abi.find(({ name }) => name === 'transfer');
  console.log('Method Name ', methodName);
  //encode the transfer method using ethers.js
  const encodedData = abiCoder.encodeFunctionCall(
    methodName,
    [
      receiver,
      tokens
    ]);

  // step 0 - clear batch
  await sdk.clearGatewayBatch();

  // step 1 - approve receiver tokens
  const erc20Contract: any = sdk.registerContract('erc20Contract', erc20Abi, erc20Address)
  console.info('erc20Contract', erc20Contract)
  const transactionRequest = erc20Contract.encodeApprove(receiver, tokens);
  console.log(' 🚀 approve request', transactionRequest)
  console.log(
    ' 🚀 add to gateway batch',
    await sdk.batchExecuteAccountTransaction(
      transactionRequest
    )
  )

  // step 2 - transfer tokens to receiver
  //this method will add the transaction to a batch, which has to be executed later.
  const transaction = await sdk.batchExecuteAccountTransaction({
    to: receiver,//wallet address
    data: encodedData,
  });

  console.log(' 🚀🚀 Encoded function call ', encodedData);

  console.log(' 🚀🚀 tranfer transaction', transaction)

  console.log('Estimating transaction');

  await sdk.estimateGatewayBatch().then(async (result) => {
    console.log('result', result)
    await sdk
      .submitGatewayBatch()
      .then(async (submitGatewayResponse) => {
        console.log('----> submitGatewayResponse', submitGatewayResponse)
        batchHash = submitGatewayResponse.hash
      })
      .catch(console.error);

  })
    .catch((error) => {
      console.log('🙉 Transaction estimation failed with error ', error);
    });
  console.log('hash', batchHash)
  var xx: string = 'wait'
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
  console.log('🙉 batch process: Sent, batch complete 🚅')
}

main()
  .catch(console.error)
  .finally(() => process.exit());
