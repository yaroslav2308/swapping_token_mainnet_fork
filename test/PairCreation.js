// Uniswap pair creater contract address - 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f

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

        const simpleSwapFactory = await ethers.getContractFactory('SimpleSwap')
        const simpleSwap = await simpleSwapFactory.deploy(SwapRouterAddress)
        await simpleSwap.deployed()
    }

    describe("Deployment", function () {
        it("Total supply should be equal to initial supply", async function () {
            await deployYaraToken();

            expect(
                await yaraToken.totalSupply()
            ).to.equal(initialSupply);
        });
    })
    

    describe("YaraToken/DAI pair creation", function () {
        it("Shoul emit pair created event", async function () {
            const uniswapFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
            const uniswapFactory = await ethers.getContractAt(uniswapFactoryAbi, uniswapFactoryAddress);

            const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

            await expect(uniswapFactory.createPair(yaraToken.address, daiAddress))
                .to.emit(uniswapFactory, "PairCreated")

            console.log(await uniswapFactory.getPair(yaraToken.address, daiAddress))
        });

        it("Should have pair in storage", async function () {
            const uniswapFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
            const uniswapFactory = await ethers.getContractAt(uniswapFactoryAbi, uniswapFactoryAddress);

            const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

            expect(await uniswapFactory.getPair(yaraToken.address, daiAddress))
                .to.not.equal(0)
        });
    })
})