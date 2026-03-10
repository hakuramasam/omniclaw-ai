// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OmniClawDAO {

 struct Proposal {

  string description;
  uint votes;

 }

 Proposal[] public proposals;

 mapping(address=>bool) public voters;

 function createProposal(string memory description) public {

  proposals.push(
   Proposal(description,0)
  );

 }

 function vote(uint id) public {

  require(!voters[msg.sender]);

  proposals[id].votes++;

  voters[msg.sender]=true;

 }

}