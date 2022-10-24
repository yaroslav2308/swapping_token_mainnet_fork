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
        const [owner, firstAccount, secondAccount] = await ethers.getSigners();
        const initialSupply = 100000000

        const YaraToken = await hre.ethers.getContractFactory("YaraToken");
        const yaraToken = await YaraToken.deploy(initialSupply);

        return { yaraToken, owner, firstAccount, secondAccount, initialSupply };
    }

    describe("Deployment", function () {
        it("Total supply should be equal to initial supply", async function () {
            const { yaraToken, initialSupply } = await loadFixture(deployYaraToken);

            expect(
                await yaraToken.totalSupply()
            ).to.equal(initialSupply);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const { yaraToken, owner, initialSupply } = await loadFixture(deployYaraToken);

            expect(
                await yaraToken.balanceOf(owner.address)
            ).to.equal(initialSupply);
        });

        it("Should have the right address of owner", async function () {
            const { yaraToken, owner } = await loadFixture(deployYaraToken);

            expect(
                await yaraToken.owner()
            ).to.equal(owner.address);
        })
    })

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            const { yaraToken, owner, firstAccount, initialSupply } = await loadFixture(deployYaraToken);

            const amount = 2000;

            await yaraToken.transfer(firstAccount.address, amount);

            expect(
                await yaraToken.balanceOf(owner.address)
            ).to.equal(initialSupply - amount);

            expect(
                await yaraToken.balanceOf(firstAccount.address)
            ).to.equal(amount);

            await yaraToken.connect(firstAccount).transfer(owner.address, amount);

            expect(
                await yaraToken.balanceOf(owner.address)
            ).to.equal(initialSupply);

            expect(
                await yaraToken.balanceOf(firstAccount.address)
            ).to.equal(0);
        });

        it("Should emit Transfer events", async function () {
            const { yaraToken, owner, firstAccount, secondAccount } = await loadFixture(deployYaraToken);

            // Transfer 50 tokens from owner to firstAccount
            await expect(yaraToken.transfer(firstAccount.address, 50))
                .to.emit(yaraToken, "Transfer")
                .withArgs(owner.address, firstAccount.address, 50);

            // Transfer 50 tokens from firstAccount to secondAccount
            // We use .connect(signer) to send a transaction from another account
            await expect(yaraToken.connect(firstAccount).transfer(secondAccount.address, 50))
                .to.emit(yaraToken, "Transfer")
                .withArgs(firstAccount.address, secondAccount.address, 50);
        })

        it("Should fail if sender doesn't have enough tokens", async function () {
            const { yaraToken, owner, firstAccount, initialSupply } = await loadFixture(deployYaraToken);
            await expect(
                yaraToken.connect(firstAccount).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance shouldn't have changed.
            expect(await yaraToken.balanceOf(owner.address)).to.equal(
                initialSupply
            )
        })
    })

    describe("Mint", function () {
        it("Should be able to mint tokens by the owner", async function () {
            const { yaraToken, firstAccount } = await loadFixture(deployYaraToken);

            const amount = 50000

            await yaraToken.mint(firstAccount.address, amount)

            expect(
                await yaraToken.balanceOf(firstAccount.address)
            ).to.equal(amount)
        })

        it("Should fail if minter is not the owner", async function () {
            const { yaraToken, firstAccount } = await loadFixture(deployYaraToken);

            const amount = 50000

            await expect(
                yaraToken.connect(firstAccount).mint(firstAccount.address, amount)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        })
    })
})