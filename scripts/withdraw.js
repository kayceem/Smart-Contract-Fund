const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe")
    const ethValue = ethers.parseEther("1")

    console.log("Withdrawing...")
    const transacationResponse = await fundMe.withdraw()
    const transacationReceipt = await transacationResponse.wait(1)
    console.log("Withdrawn")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
