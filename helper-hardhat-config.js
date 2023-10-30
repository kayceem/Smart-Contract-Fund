const networkConfig = {
    31337: {
        name: "localhost",
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}

const developmentChains = [31337]
const DECIMALS = 8
const INITITAL_ANSWER = 200000000000

module.exports = {
    networkConfig,
    developmentChains,
    INITITAL_ANSWER,
    DECIMALS,
}
