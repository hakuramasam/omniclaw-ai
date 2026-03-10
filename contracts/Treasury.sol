pragma solidity ^0.8.20;

contract Treasury {

 address public dao;

 constructor(address _dao){

  dao=_dao;

 }

 receive() external payable{}

 function withdraw(address to,uint amount) public{

  require(msg.sender==dao);

  payable(to).transfer(amount);

 }

}