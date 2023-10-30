const { getNamedAccounts, ethers } = require("hardhat");


async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe");
    const ethValue = ethers.parseEther("1")

    console.log("Funding...");
    const transacationResponse = await fundMe.fund({ value: ethValue });
    const transacationReceipt = await transacationResponse.wait(1);
    console.log("Funded");
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
