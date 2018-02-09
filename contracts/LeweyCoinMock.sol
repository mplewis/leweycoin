pragma solidity ^0.4.18;

import './LeweyCoin.sol';
import './EthExchangeRateMock.sol';

contract LeweyCoinMock is LeweyCoin, EthExchangeRateMock {}
