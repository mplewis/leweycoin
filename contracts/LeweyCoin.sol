pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract LeweyCoin is Ownable {
  using SafeMath for uint;

  mapping (address => uint) balance;

  // Owner-only

  function kill() public onlyOwner {
    selfdestruct(owner);
  }

  function ownerWithdraw(uint amount) public onlyOwner {
    require (this.balance > amount);
    owner.transfer(amount);
  }

  function mint(address recipient, uint amount) public onlyOwner {
    balance[recipient] = balance[recipient].add(amount);
  }

  // Receive deposits

  function () public payable {}

  // Views

  function contractBalance() public view returns (uint) {
    return this.balance;
  }

  function balanceOf(address recipient) public view returns (uint) {
    return balance[recipient];
  }

  function myBalance() public view returns (uint) {
    return balanceOf(msg.sender);
  }

  // Public functions

  function withdraw(uint amount) public {
    require (this.balance > amount);

    address recipient = msg.sender;
    require (balance[recipient] >= amount);

    balance[recipient] = balance[recipient].sub(amount);
    recipient.transfer(amount);
  }
}