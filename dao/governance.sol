// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Governance {
    address public owner;
    mapping(address => bool) public voters;

    event VoterSet(address indexed voter, bool allowed);
    event Voted(address indexed voter);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setVoter(address voter, bool allowed) public onlyOwner {
        voters[voter] = allowed;
        emit VoterSet(voter, allowed);
    }

    function vote() public {
        require(voters[msg.sender], "not allowed");
        emit Voted(msg.sender);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "zero address");
        owner = newOwner;
    }
}
