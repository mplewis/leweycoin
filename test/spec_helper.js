const ETH = 1000000000000000000
const TYPICAL_FEE = 0.004 * ETH

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const { expect } = chai

const solidityHelpers = (chai, utils) => {
  const SUCCESS = '0x01'
  const FAILURE = '0x00'
  const statusIs = code =>
    function () {
      const obj = utils.flag(this, 'object')
      const status = obj.receipt.status
      return new chai.Assertion(status).to.be.equal(
        code,
        `Expected transaction status ${status} to equal ${code}`
      )
    }
  utils.addChainableMethod(
    chai.Assertion.prototype,
    'succeed',
    statusIs(SUCCESS)
  )
  utils.addChainableMethod(chai.Assertion.prototype, 'fail', statusIs(FAILURE))
}
chai.use(solidityHelpers)

const balanceOf = address => web3.eth.getBalance(address).toNumber()

module.exports = { ETH, TYPICAL_FEE, expect, balanceOf }
