const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verifyContract");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const ethUsdPriceFeedAddress = developmentChains.includes(chainId) ?
        (await deployments.get("MockV3Aggregator")).address :
        networkConfig[chainId]["ethUsdPriceFeed"];
    const args = [ethUsdPriceFeedAddress];

    log("Deploying FundMe contract...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    log("FundMe contract deployed.")

    !developmentChains.includes(chainId) &&
        process.env.ETHERSCAN_API_KEY &&
        await verify(fundMe.address, args);
    log("------------------------------------------------------");
}
module.exports.tags = ["all", "fundme"]