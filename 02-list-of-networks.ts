import { Sdk, randomPrivateKey, NetworkNames, EnvNames } from 'etherspot';
import { GetGatewaySupportedTokenDto } from 'src';

/**
 * Example code to list all supported networks on etherspot.
 */

async function main(): Promise<void> {
  const sdk1 = new Sdk(randomPrivateKey(), {
    env: EnvNames.TestNets, 
  });
  console.log('Supported test networks ', sdk1.supportedNetworks);

  const sdk2 = new Sdk(randomPrivateKey(), {
      env: EnvNames.MainNets,
  });
  console.log('Supported mainnet networks ', sdk2.supportedNetworks);

}

main()
  .catch(console.error)
  .finally(() => process.exit());
