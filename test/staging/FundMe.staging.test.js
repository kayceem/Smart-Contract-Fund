const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config");


const ethValue = ethers.parseEther("0.01");

developmentChains.includes(network.config.chainId) ?
    describe.skip :
    describe("FundMe", function () {
        let fundMe;
        let deployer;
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            fundMe = await ethers.getContract("FundMe", deployer);
        });
        // it("check minimum usd", async () => {
        //     await expect(fundMe.fund()).to.be.revertedWithCustomError(
        //         fundMe,
        //         "FundMe_InsufficientUsd"
        //     );
        // });
        // it("update sent funds by the address", async () => {
        //     const transacationResponse = await fundMe.fund({ value: ethValue });
        //     const transacationReceipt = await transacationResponse.wait(1);
        //     const fundedAmount = await fundMe.getAddressToAmount(deployer);
        //     assert.equal(fundedAmount.toString(), ethValue.toString());
        // });
        it("withdraw amount", async () => {
            const transacationResponse = await fundMe.withdraw();
            const transacationReceipt = await transacationResponse.wait(1);
            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            );
            assert.equal(endingFundMeBalance.toString(), "0");

        });
    })