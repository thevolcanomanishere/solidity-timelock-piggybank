"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { expect } from "chai";
const chai_1 = require("chai");
const console_1 = require("console");
const hardhat_1 = require("hardhat");
describe("TimeLock", function () {
    let timeLock;
    beforeEach(async () => {
        const TimeLock = await hardhat_1.ethers.getContractFactory("TimeLockStorage");
        timeLock = await TimeLock.deploy();
        await timeLock.deployed();
    });
    it("Should store and return a timelock", async function () {
        const blockNumBefore = await hardhat_1.ethers.provider.getBlockNumber();
        const blockBefore = await hardhat_1.ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        console.log(`Before : `, timestampBefore);
        const futureTime = timestampBefore + 100;
        const tx = await timeLock.storeTimeLock(futureTime, {
            value: hardhat_1.ethers.utils.parseEther("1.0"),
        });
        await tx.wait(1);
        const viewTimeLocks = await timeLock.viewTimeLocks();
        (0, chai_1.expect)(viewTimeLocks.length).to.equal(1);
    });
    it("Should return the users balance", async function () {
        const blockNumBefore = await hardhat_1.ethers.provider.getBlockNumber();
        const blockBefore = await hardhat_1.ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        const futureTime = timestampBefore + 5;
        const tx = await timeLock.storeTimeLock(futureTime, {
            value: hardhat_1.ethers.utils.parseEther("1.0"),
        });
        await tx.wait(1);
        await hardhat_1.ethers.provider.send("evm_setNextBlockTimestamp", [futureTime]);
        const tx2 = await timeLock.withDrawAllFromTimeLock();
        await tx2.wait(1);
        (0, console_1.assert)((await hardhat_1.ethers.provider.getBalance(timeLock.address)).toNumber() === 0);
    });
});
