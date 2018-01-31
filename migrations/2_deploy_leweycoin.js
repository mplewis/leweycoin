var LeweyCoin = artifacts.require("./LeweyCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(LeweyCoin);
};
