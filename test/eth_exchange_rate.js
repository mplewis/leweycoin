const { ETH, expect } = require('./spec_helper')

const EthExchangeRate = artifacts.require('EthExchangeRateMock')

contract('EthExchangeRate', function (accounts) {
  const [user] = accounts
  let EER
  beforeEach(async () => (EER = await EthExchangeRate.new(user)))

  async function getNum (method, ...args) {
    const bigNumber = await EER[method](...args)
    return bigNumber.toNumber()
  }

  context('with a fixed exchange rate of 1 ETH = $1000', function () {
    beforeEach(() => EER.setNewExchangeRate(1000 * ETH))

    it('mocks properly', async function () {
      const price = await getNum('ethPriceFromMakerDaoOracle')
      expect(price).to.equal(1000 * ETH)
    })
  })

  describe('usdToWei', function () {
    const subject = async usd => getNum('usdToWei', usd)

    context('with a fixed exchange rate of 1 ETH = $250', function () {
      beforeEach(() => EER.setNewExchangeRate(250 * ETH))

      it('converts USD to wei', async function () {
        expect(await subject(1)).to.eql(0.004 * ETH)
        expect(await subject(250)).to.eql(1 * ETH)
        expect(await subject(1200)).to.eql(4.8 * ETH)
      })
    })

    context('with a fixed exchange rate of 1 ETH = $1000', function () {
      beforeEach(() => EER.setNewExchangeRate(1000 * ETH))

      it('converts USD to wei', async function () {
        expect(await subject(1)).to.eql(0.001 * ETH)
        expect(await subject(2000)).to.eql(2 * ETH)
        expect(await subject(7500)).to.eql(7.5 * ETH)
      })
    })
  })
})
