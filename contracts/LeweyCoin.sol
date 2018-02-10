pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import './EthExchangeRate.sol';

contract LeweyCoin is Ownable, EthExchangeRate {
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

  function balanceFor(address recipient) public view returns (uint) {
    return balance[recipient];
  }

  // Public functions

  function withdraw() public {
    address recipient = msg.sender;
    uint leweyCoins = balance[recipient];

    uint weiToPayout;
    bool success;
    (weiToPayout, success) = usdToWei(leweyCoins);
    require(success);
    require(this.balance >= weiToPayout);

    balance[recipient] = 0;
    recipient.transfer(weiToPayout);
  }
}
