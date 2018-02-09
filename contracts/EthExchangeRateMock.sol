pragma solidity ^0.4.18;

import "./EthExchangeRate.sol";

contract EthExchangeRateMock is EthExchangeRate () {
  uint rawOracleValue;

  function ethPriceFromMakerDaoOracle() public view returns (uint) {
    return rawOracleValue;
  }

  function setNewExchangeRate(uint newExchangeRate) public {
    rawOracleValue = newExchangeRate;
  }
}
