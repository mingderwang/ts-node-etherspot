const Web3 = require("web3");

let web3 = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider("https://mainnet.infura.io/ws/v3/6835ff4f8cb1454093e9ddf037830185")
);
