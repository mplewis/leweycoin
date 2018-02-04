const { ETH, expect } = require('./spec_helper')

const LeweyCoin = artifacts.require('LeweyCoin')

contract('LeweyCoin', function (accounts) {
  const [creator, user] = accounts
  let LC
  beforeEach(async () => (LC = await LeweyCoin.new(creator)))

  async function getNum (method, ...args) {
    const bigNumber = await LC[method](...args)
    return bigNumber.toNumber()
  }

  it('sets the proper initial state', async function () {
    const owner = await LC.owner()
    expect(owner).to.eql(creator)
    expect(await getNum('balanceOf', creator)).to.eql(0)
    expect(await getNum('balanceOf', user)).to.eql(0)
  })

  context('funding the contract', function () {
    beforeEach(async () => LC.send(0.1 * ETH))

    describe('contractBalance', function () {
      const subject = () => getNum('contractBalance')

      it('returns the expected balance', async function () {
        return expect(subject()).to.eventually.eql(0.1 * ETH)
      })
    })
  })

  describe('selfdestruct', function () {
    let sender
    const subject = () => LC.kill({ from: sender })

    context('by non-owner', function () {
      beforeEach(() => (sender = user))

      it('fails', async function () {
        expect(await subject()).to.fail()
      })
    })

    context('by creator', function () {
      beforeEach(() => (sender = creator))

      it('succeeds', async function () {
        expect(await subject()).to.succeed()
      })
    })
  })
})
