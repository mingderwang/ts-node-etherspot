#!/usr/bin/env ts-node
import {
  Sdk,
  Env,
  EnvNames,
  MetaMaskWalletProvider,
  NetworkNames,
  sleep,
  randomPrivateKey,
} from "etherspot";
import "dotenv/config";
let xx = "Wait 🙉";

Env.defaultName = EnvNames.TestNets; // change this one for MainNets or TestNets

const PRIVATE_KEY = randomPrivateKey(); //process.env.PRIVATE_KEY;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const KEY_NETWORK = NetworkNames.Etherspot; // change this for different network, such as Ropsten
const RECEIVER = "0xE65B3A72e9d772Dd19719Dec92b1dE900fD178B0";

async function main() {
  let sdk: Sdk;

  sdk = new Sdk({
    privateKey:
      "0x5219f6835837698382a07d7e813e08734445d27204b1c4f77f413317c4563394",
  });

  console.info("SDK created");
}

main()
  .catch(console.error)
  .finally(() => process.exit());
