//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TimeLockStorage {
    struct TimeLock {
        uint256 unlockTime;
        uint256 amount;
    }

    mapping(address => TimeLock[]) timeLocks;

    event Deposit(address sender, uint256 unlockTime, uint256 amount);
    event Withdraw(address sender, uint256 amount);

    function storeTimeLock(uint256 time) public payable {
        TimeLock memory lock = TimeLock(time, msg.value);
        timeLocks[msg.sender].push(lock);
        emit Deposit(msg.sender, lock.unlockTime, lock.amount);
    }

    function viewTimeLocks(address userAddress)
        public
        view
        returns (TimeLock[] memory)
    {
        return timeLocks[userAddress];
    }

    function withdraw() public payable {
        uint256 amount;
        for (uint256 i = 0; i < timeLocks[msg.sender].length; i++) {
            if (timeLocks[msg.sender][i].unlockTime >= block.timestamp) {
                amount = amount + timeLocks[msg.sender][i].amount;
            }
        }
        console.log(amount);
        address payable to = payable(msg.sender);
        to.transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
}
