pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Medianizer {
  function compute() public constant returns (bytes32, bool);
}

contract EthExchangeRate {
  using SafeMath for uint;

  uint weiPerEth = 1000000000000000000;

  function ethPriceFromMakerDaoOracle() public view returns (uint) {
    address makerDaoEthPriceFeedAddress = 0x729D19f657BD0614b4985Cf1D82531c67569197B;
    Medianizer makerDaoEthPriceFeed = Medianizer(makerDaoEthPriceFeedAddress);

    bytes32 rawOracleValue;
    bool feedValid;
    (rawOracleValue, feedValid) = makerDaoEthPriceFeed.compute();
    require(feedValid);

    return uint(rawOracleValue);
  }

  function usdToWei(uint usd) public view returns (uint) {
    uint ethPriceInUsdTimesWei = ethPriceFromMakerDaoOracle();
    return usd.mul(weiPerEth).mul(weiPerEth).div(ethPriceInUsdTimesWei);
  }
}
