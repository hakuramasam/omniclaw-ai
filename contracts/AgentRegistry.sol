pragma solidity ^0.8.20;

contract AgentRegistry {

 struct Agent {

  address owner;
  string metadata;

 }

 Agent[] public agents;

 function register(string memory metadata) public {

  agents.push(
   Agent(msg.sender,metadata)
  );

 }

}