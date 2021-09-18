# learn etherspot by examples
* sample examples are git cloned from https://github.com/pillarwallet/etherspot-sdk-examples.git

## transfer ethers
* refer to: 03-submit-eth-transaction.ts

### build & run
```
yarn
```
```
yarn dev03
```
> make sure you have to fund enough ETHs in your "Smart Wallet Contract" respective to your sdk (key) account, where is 
[0xbf4f2d1fdaf898df5d9a53a9a5019856db88aa1b](
https://ropsten.etherscan.io/address/0xbf4f2d1fdaf898df5d9a53a9a5019856db88aa1b)

> check with the balance of your receiver account. https://ropsten.etherscan.io/address/0x940d89BFAB20d0eFd076399b6954cCc42Acd8e15#internaltx

## transfer tokens
* refer to: 04-submit-token-transaction.ts 
after batch complete, you can check your allownce for receiver on etherscan as follow;

> actually this batch tranfer is powerful when you need to transfer multiple recipients in one smart contract call.


### build & run
```
yarn
```
```
yarn dev04
```
![](./images/04-demo-check-result.png)

