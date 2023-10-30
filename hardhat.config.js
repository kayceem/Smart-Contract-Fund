require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-verify")
require("@nomiclabs/hardhat-ethers")
require("dotenv").config()
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("solidity-coverage")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

module.exports = {
    defaultNetwork: "hardhat",

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },

    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
    },

    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
    },
    solidity: { compilers: [{ version: "0.8.18" }, { version: "0.6.6" }] },
}
