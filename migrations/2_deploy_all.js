const CONTRACTS = ['LeweyCoin', 'EthExchangeRateMock']

module.exports = function (deployer) {
  CONTRACTS.forEach(name => deployer.deploy(artifacts.require(`./${name}.sol`)))
}
