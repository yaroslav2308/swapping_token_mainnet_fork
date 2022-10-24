// Uniswap pair creater contract address - 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const uniswapFactoryAbi = require("../abis/uniswapFactoryAbi.json");

describe("Swap process", function () {

    const initialSupply = 100000000
    let owner
    let firstAccount
    let secondAccount
    let yaraToken
    
    async function deployYaraToken() {
        // Contracts are deployed using the first signer/account by default
        [owner, firstAccount, secondAccount] = await ethers.getSigners();
        

        const YaraToken = await hre.ethers.getContractFactory("YaraToken");
        yaraToken = await YaraToken.deploy(initialSupply);
    }

    describe("Deployment", function () {
        it("Total supply should be equal to initial supply", async function () {
            await deployYaraToken();

            expect(
                await yaraToken.totalSupply()
            ).to.equal(initialSupply);
        });
    })

    describe("Pair creation", function () {
        it("Shoul emit pair created event", async function () {
            const uniswapFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
            const uniswapFactory = await ethers.getContractAt(uniswapFactoryAbi, uniswapFactoryAddress);
            
            const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

            await expect(uniswapFactory.createPair(yaraToken.address, daiAddress))
                .to.emit(uniswapFactory, "PairCreated")
        });
    })


})