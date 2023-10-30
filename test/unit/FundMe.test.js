const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

const ethVlaue = ethers.parseEther("0.1");

!developmentChains.includes(network.config.chainId) ?
    describe.skip :
    describe("FundMe", function () {
        let fundMe;
        let deployer;
        let mockV3Aggregator;

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);
            fundMe = await ethers.getContract("FundMe", deployer);
            mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
        });

        describe("constructor", function () {
            it("set aggregator address", async () => {
                const response = await fundMe.getPriceFeed();
                assert.equal(response, mockV3Aggregator.target);
            });
            it("set owner address", async () => {
                const response = await fundMe.getOwner();
                assert.equal(deployer, response);
            });
        });

        describe("fund", function () {
            it("check minimum usd", async () => {
                await expect(fundMe.fund()).to.be.revertedWithCustomError(
                    fundMe,
                    "FundMe_InsufficientUsd"
                );
            });
            it("add funder to funders", async () => {
                await fundMe.fund({ value: ethVlaue });
                const funder = await fundMe.getFunder(0);
                assert.equal(funder, deployer);
            });
            it("update sent funds by the address", async () => {
                await fundMe.fund({ value: ethVlaue });
                const fundedAmount = await fundMe.getAddressToAmount(deployer);
                assert.equal(fundedAmount.toString(), ethVlaue.toString());
            });
        });

        describe("withdraw", function () {
            beforeEach(async () => {
                await fundMe.fund({ value: ethVlaue });
            });

            it("check if request is from owner", async () => {
                const attacker = (await ethers.getSigners())[1];
                const fundMeFromAttacker = await fundMe.connect(attacker)
                await expect(fundMeFromAttacker.withdraw()).to.be.revertedWithCustomError(
                    fundMe,
                    "FundMe_InvalidOwner"
                );
            });
            it("clear funded ammount for each funder in addressToAmount", async () => {
                const accounts = await ethers.getSigners();
                for (let i = 0; i < accounts.length; i++) {
                    const fundMeFromUser = await fundMe.connect(accounts[i]);
                    await fundMeFromUser.fund({ value: ethVlaue });
                }
                await fundMe.withdraw();
                for (let i = 0; i < accounts.length; i++) {
                    const fundedAmount = await fundMe.getAddressToAmount(accounts[i]);
                    assert.equal(fundedAmount.toString(), "0");
                }
            });
            it("clear getFunder(array)", async () => {
                await fundMe.withdraw();
                await expect(fundMe.getFunder(0)).to.be.reverted;
            });
            it("check withdraw when only one funder", async () => {
                const startingFundMeBalance = await ethers.provider.getBalance(
                    fundMe.target
                );
                const startingDeployerBalance = await ethers.provider.getBalance(
                    deployer
                );
                const transactionResponse = await fundMe.withdraw();
                const transactionReceipt = await transactionResponse.wait(1);
                const totalGas = transactionReceipt.gasUsed * transactionReceipt.gasPrice;
                const endingDeployerBalance = await ethers.provider.getBalance(
                    deployer
                );
                assert.equal(startingDeployerBalance + startingFundMeBalance, endingDeployerBalance + totalGas);

            });
        });
        it("check withdraw when many funders", async () => {
            const accounts = await ethers.getSigners();
            for (let i = 0; i < accounts.length; i++) {
                const fundMeFromUser = await fundMe.connect(accounts[i]);
                await fundMeFromUser.fund({ value: ethVlaue });
            }
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            );
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            );
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            const totalGas = transactionReceipt.gasUsed * transactionReceipt.gasPrice;
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            );
            assert.equal(startingDeployerBalance + startingFundMeBalance, endingDeployerBalance + totalGas);
        });

    });