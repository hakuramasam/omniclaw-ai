// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Treasury {
    address public owner;

    event Withdraw(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function withdraw(address payable to, uint256 amount) public onlyOwner {
        require(to != address(0), "zero address");
        require(address(this).balance >= amount, "insufficient balance");
        to.transfer(amount);
        emit Withdraw(to, amount);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "zero address");
        owner = newOwner;
    }
}
