import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("OrderBasedSwap", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOrderBasedSwap() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const OrderBasedSwap = await ethers.getContractFactory("OrderBasedSwap");
    const swapContract = await OrderBasedSwap.deploy();

    return { swapContract, owner, otherAccount };
  }

  describe("Create Order", function () {
    it("Should create an order successfully", async function () {
      const { swapContract, owner, otherAccount } = await loadFixture(deployOrderBasedSwap);

      // Deploy test ERC20 tokens for testing
      const TestERC20 = await ethers.getContractFactory("TestERC20");
      const tokenA = await TestERC20.deploy();
      const tokenB = await TestERC20.deploy();

      // Approve swapContract to spend tokenA
      const amountToSell = ethers.parseUnits("100", 18);
      await tokenA.approve(swapContract, amountToSell);

      // Create order
      const amountToBuy = ethers.parseUnits("50", 18);
      await expect(swapContract.createOrder(
        tokenA,
        amountToSell,
        tokenB,
        amountToBuy
      )).to.emit(swapContract, "OrderCreated")
        .withArgs(0, owner, tokenA, amountToSell, tokenB, amountToBuy);

      // Check if tokens were transferred to the contract
      expect(await tokenA.balanceOf(swapContract)).to.equal(amountToSell);
    });
  });
  describe("Fulfill order", function () {
    it("Should fulfill an order successfully", async function () {
      const { swapContract, owner, otherAccount } = await loadFixture(deployOrderBasedSwap);

      // Deploy test ERC20 tokens for testing
      const TestERC20 = await ethers.getContractFactory("TestERC20");
      const tokenA = await TestERC20.deploy();
      const tokenB = await TestERC20.deploy();

      // Create an order
      const amountToSell = ethers.parseUnits("100", 18);
      const amountToBuy = ethers.parseUnits("50", 18);
      await tokenA.approve(swapContract, amountToSell);
      await swapContract.createOrder(tokenA, amountToSell, tokenB, amountToBuy);

      // Prepare otherAccount to fulfill the order
      await tokenB.transfer(otherAccount, amountToBuy);
      await tokenB.connect(otherAccount).approve(swapContract, amountToBuy);

      // Record balances before fulfilling the order
      const sellerTokenABalBefore = await tokenA.balanceOf(owner);
      const sellerTokenBBalBefore = await tokenB.balanceOf(owner);
      const buyerTokenABalBefore = await tokenA.balanceOf(otherAccount);
      const buyerTokenBBalBefore = await tokenB.balanceOf(otherAccount);

      // Fulfill the order
      await expect(swapContract.connect(otherAccount).fulfillOrder(0))
        .to.emit(swapContract, "OrderFulfilled")
        .withArgs(0, otherAccount.address);

      // Check balances after fulfilling the order
      expect(await tokenB.balanceOf(owner)).to.equal(sellerTokenBBalBefore + amountToBuy);
      expect(await tokenA.balanceOf(otherAccount)).to.equal(buyerTokenABalBefore + amountToSell);

      // Check that the order is marked as fulfilled
      expect(await swapContract.orderFulfilled(0)).to.be.true;
    });
  })
});
