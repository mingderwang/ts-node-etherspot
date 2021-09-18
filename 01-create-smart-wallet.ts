import { Sdk, randomPrivateKey, NetworkNames, EnvNames } from 'etherspot';

/**
 * Example code to create smart wallet on kovan testnet using etherspot sdk
 * the generated smart wallet is not deployed on chain until the first transaction.
 */

async function main(): Promise<void> {
  const sdk = new Sdk(randomPrivateKey(), {
    env: EnvNames.TestNets, // Use EnvNames.Mainnet, If you are accessing Mainnets
    networkName: NetworkNames.Kovan,
    //projectKey: 'test-project', //optional can be used to uniquely identify your project
  });

  const { state } = sdk;

  console.log('create session', await sdk.createSession());

  console.log(
    'create session with ttl',
    await sdk.createSession({
      ttl: 100,
    }),
  );

  console.log('Sync account', await sdk.syncAccount());
  console.log('Smart wallet', state.account);

}

main()
  .catch(console.error)
  .finally(() => process.exit());
