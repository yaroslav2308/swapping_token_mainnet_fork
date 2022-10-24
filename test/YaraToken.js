const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("YaraToken", function () {

    async function deployYaraToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        const initialSupply = 100000000

        const YaraToken = await hre.ethers.getContractFactory("YaraToken");
        const yaraToken = await YaraToken.deploy(initialSupply);

        // console.log(
        //     `YaraToken deployed to ${yaraToken.address}`
        // );
        // console.log(
        //     `owner is ${owner.address}`
        // );

        return { yaraToken, owner, otherAccount, initialSupply };
    }

    describe("Deployment", function () {
        it("Total supply should be equal to initial supply", async function () {
            const { yaraToken, initialSupply } = await loadFixture(deployYaraToken);

            expect(await yaraToken.totalSupply()).to.equal(initialSupply);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const { yaraToken, owner, initialSupply } = await loadFixture(deployYaraToken);

            expect(await yaraToken.balanceOf(owner.address)).to.equal(initialSupply);
        });

        it("Should have the right address of owner", async function () {
            const { yaraToken, owner } = await loadFixture(deployYaraToken);

            expect(await yaraToken.owner()).to.equal(owner.address);
        })
    })

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const { yaraToken, owner, otherAccount, initialSupply} = await loadFixture(deployYaraToken);

            const amount = 2000;

            await yaraToken.transfer(otherAccount.address, amount);

            expect(await yaraToken.balanceOf(owner.address)).to.equal(initialSupply - amount);

            expect(await yaraToken.balanceOf(otherAccount.address)).to.equal(amount);

            await yaraToken.connect(otherAccount).transfer(owner.address, amount);

            expect(await yaraToken.balanceOf(owner.address)).to.equal(initialSupply);

            expect(await yaraToken.balanceOf(otherAccount.address)).to.equal(0);
        });

        it("Should emit Transfer events", async function () {
        })

        it("Should fail if sender doesn't have enough tokens", async function () {

        })
    })

    describe("Mint", function () {
        it("Should be able to mint tokens by the owner", async function () {
            const { yaraToken, otherAccount} = await loadFixture(deployYaraToken); 

            const amount = 50000

            await yaraToken.mint(otherAccount.address, amount)

            expect(await yaraToken.balanceOf(otherAccount.address)).to.equal(amount)
        })

        it("Should fail if minter it not the owner", async function() {
            const { yaraToken, otherAccount} = await loadFixture(deployYaraToken); 

            const amount = 50000

            await expect(yaraToken.connect(otherAccount).mint(otherAccount.address, amount)).to.be.revertedWith("Ownable: caller is not the owner");
        })
    })
})