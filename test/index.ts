// import { expect } from "chai";
import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { TimeLockStorage } from "../typechain";

describe("TimeLock", function () {
  let timeLock: TimeLockStorage;
  beforeEach(async () => {
    const TimeLock = await ethers.getContractFactory("TimeLockStorage");
    timeLock = await TimeLock.deploy();
    await timeLock.deployed();
  });

  it("Should store and return a timelock", async function () {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    console.log(`Before : `, timestampBefore);
    const futureTime = timestampBefore + 100;
    const tx = await timeLock.storeTimeLock(futureTime, {
      value: ethers.utils.parseEther("1.0"),
    });
    await tx.wait(1);
    const viewTimeLocks = await timeLock.viewTimeLocks();
    expect(viewTimeLocks.length).to.equal(1);
  });

  it("Should return the users balance", async function () {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;
    const futureTime = timestampBefore + 5;

    const tx = await timeLock.storeTimeLock(futureTime, {
      value: ethers.utils.parseEther("1.0"),
    });
    await tx.wait(1);

    await ethers.provider.send("evm_setNextBlockTimestamp", [futureTime]);

    const tx2 = await timeLock.withdraw();
    await tx2.wait(1);

    assert(
      (await ethers.provider.getBalance(timeLock.address)).toNumber() === 0
    );
  });
});
