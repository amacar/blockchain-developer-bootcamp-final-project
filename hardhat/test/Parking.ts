import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, web3 } from "hardhat";

import { Parking, Parking__factory } from "../typechain";

describe("Parking", function () {
  let accounts: Signer[];
  let parkingContract: Parking;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const parkingFactory = (await ethers.getContractFactory(
      "Parking",
      accounts[0]
    )) as Parking__factory;

    parkingContract = await parkingFactory.deploy();
  });

  describe("Withdraw", function () {
    it("Should empty contract balance when withdrawing", async function () {
      const value = await parkingContract.PRICE();
      const from = await accounts[0].getAddress();
      await web3.eth.sendTransaction({
        from,
        to: parkingContract.address,
        value: value.toString(),
      });
      expect(await web3.eth.getBalance(parkingContract.address)).to.equal(
        value.toString()
      );

      const balanceBeforeWithdrawing = await web3.eth.getBalance(from);
      const withdrawCall = await parkingContract.withdraw();
      const { gasUsed } = await web3.eth.getTransactionReceipt(
        withdrawCall.hash
      );
      const txFee = withdrawCall.gasPrice!.mul(gasUsed);
      const balanceAfterWithdrawing = await web3.eth.getBalance(from);

      expect(await web3.eth.getBalance(parkingContract.address)).to.equal("0");
      expect(value.add(balanceBeforeWithdrawing).sub(txFee)).to.equal(
        balanceAfterWithdrawing
      );
    });

    it("Should throw an error if non contract owner tries to withdraw funds", async function () {
      expect(
        parkingContract.connect(accounts[1]).withdraw()
      ).eventually.to.be.rejectedWith();
    });
  });
});
