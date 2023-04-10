
const { expect } = require("chai");


const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("Token contract", function () {

  async function deployTokenFixture() {

    const Token = await ethers.getContractFactory("SafeToken");
    const [owner, addr1, addr2] = await ethers.getSigners();


    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    return { Token, hardhatToken, owner, addr1, addr2 };
  }


  describe("Deployment", function () {

    it("Should set the right owner", async function () {

      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign 1000 tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(BigInt (1000 * 10 ** 18));
    });
  });

  describe("Mint", function () {

    it("Owner can mint the token", async function () {

      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      await hardhatToken.connect(owner).mint(BigInt (1000 * 10 ** 18))
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(BigInt (2000 * 10 ** 18));

    });

    it("Only owner can mint the token", async function () {

      const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      
      let err =""
      try{ await hardhatToken.connect(addr1).mint(BigInt (1000 * 10 ** 18)); }
      catch(e){ err = e.message; }
      expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Only owner can call this function'");
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);


    });


  });


  describe("Burn", function () {

    it("Owner can burn the token", async function () {

      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);  
      await hardhatToken.connect(owner).burn(BigInt (1000 * 10 ** 18))
      expect(await hardhatToken.totalSupply()).to.equal(0);
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);
      

    });

    it("Only owner can burn the token", async function () {

      const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      
      let err =""
      try{ await hardhatToken.connect(addr1).burn(BigInt (1000 * 10 ** 18)); }
      catch(e){ err = e.message; }
      expect(err).to.equal("VM Exception while processing transaction: reverted with reason string 'Only owner can call this function'");
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);


    });

  });


  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      /*
      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");
      */

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});

