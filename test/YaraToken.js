const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");

  describe("YaraToken", function () {

    async function deployYaraToken() {
        // Contracts are deployed using the first signer/account by default
        const [deploymentAccount, otherAccount] = await ethers.getSigners();

        const YaraToken = await hre.ethers.getContractFactory("YaraToken");
        const yaraToken = await YaraToken.deploy();

        console.log(
            `YaraToken deployed to ${yaraToken.address}`
        );
        console.log(
            `deploymentAccount is ${deploymentAccount.address}`
        );

        return { yaraToken, deploymentAccount, otherAccount };
    }

    describe("Deployment", function () {
        it("Total supply should be equal to 1_000_000", async function () {
          const { yaraToken, deploymentAccount } = await loadFixture(deployYaraToken);

          const tokens = 1000000
    
          expect(await yaraToken.totalSupply()).to.equal(tokens);
        });

        it("Deployment account should have minted 1000000 tokens", async function () {
            const { yaraToken, deploymentAccount } = await loadFixture(deployYaraToken);
  
            const tokens = 1000000
      
            expect(await yaraToken.balanceOf(deploymentAccount.address)).to.equal(tokens);
        });
    })
  })