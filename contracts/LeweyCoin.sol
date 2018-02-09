pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Medianizer {
  function compute() public constant returns (bytes32, bool);
}

contract LeweyCoin is Ownable {
  using SafeMath for uint;

  mapping (address => uint) balance;

  uint weiPerEth = 1000000000000000000;

  // Owner-only

  function kill() public onlyOwner {
    selfdestruct(owner);
  }

  function ownerWithdraw(uint amount) public onlyOwner {
    require(this.balance > amount);
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

  function balanceFor(address recipient) public view returns (uint) {
    return balance[recipient];
  }

  // Public functions

  function withdraw() public {
    address recipient = msg.sender;
    uint amount = balance[recipient];
    require(this.balance >= amount);

    balance[recipient] = balance[recipient].sub(amount);
    recipient.transfer(amount);
  }
}
