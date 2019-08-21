var defaultnode = "https://mohit.blockchain.azure.com:3200/bolxdtah7rk8OJ0t_gT2giOc";
var Web3 = require("web3");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    azureNetwork: {
	    provider: new Web3.providers.HttpProvider(defaultnode),
	    network_id: "*",
      password: "Mohit@7419140386",
      gasPrice : 0,
      gas: 4612388
    }
  }
};
