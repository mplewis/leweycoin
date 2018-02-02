const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const { expect } = chai

const LeweyCoin = artifacts.require('LeweyCoin')

const eth = 1000000000000000000

contract('LeweyCoin', function (accounts) {
  let LC
  let owner
  beforeEach(async () => {
    LC = await LeweyCoin.deployed()
    owner = await LC.owner()
  })

  async function getNum (method, ...args) {
    const bigNumber = await LC[method](...args)
    return bigNumber.toNumber()
  }

  it('sets the proper initial state', async function () {
    expect(owner).to.eql(accounts[0])
    expect(getNum('balanceOf', owner)).to.eventually.eql(0)
  })

  context('funding the contract', function () {
    beforeEach(async () => LC.send(5 * eth))

    describe('contractBalance', function () {
      const subject = () => getNum('contractBalance')

      it('returns the expected balance', async function () {
        expect(subject()).to.eventually.eql(5 * eth)
      })
    })
  })
})
