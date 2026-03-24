// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SkillRegistry {
    address public owner;
    mapping(string => address) public skills;

    event SkillRegistered(string name, address indexed owner);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function register(string memory name) public onlyOwner {
        skills[name] = msg.sender;
        emit SkillRegistered(name, msg.sender);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "zero address");
        owner = newOwner;
    }
}
