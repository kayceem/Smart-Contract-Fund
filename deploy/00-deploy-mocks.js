const { network } = require("hardhat")
const { developmentChains, DECIMALS, INITITAL_ANSWER } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(chainId)) {
        log("Local network: Deploying mocks...")
        await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS, INITITAL_ANSWER],
            log: true,
        })
        log("Local network: Mocks deployed.")
        log("------------------------------------------------------")
    } else {
        log("Skipping Mocks.")
        log("------------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
