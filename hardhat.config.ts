import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
// const KOVAN_RPC_URL =
//   process.env.KOVAN_RPC_URL ||
//   "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL || "";
const MATIC_RPC_URL = process.env.MATIC_RPC_URL || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";
// const RPC_URL = process.env.RPC_URL;

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: ROPSTEN_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    matic: {
      url: MATIC_RPC_URL,
      chainId: 137,
      accounts: [PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: "eur",
    token: "MATIC",
    noColors: true,
    outputFile: "gas-report.txt",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
    },
  },
};

export default config;
