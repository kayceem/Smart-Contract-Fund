const { getNamedAccounts, ethers } = require("hardhat");


async function main() {
    const { deployer } = await getNamedAccounts();
    const balance = await ethers.provider.getBalance(deployer);
    console.log(ethers.formatEther(balance));
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
