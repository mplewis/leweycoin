const { ETH, expect, balanceOf } = require('./spec_helper')

const LeweyCoin = artifacts.require('LeweyCoin')

contract('LeweyCoin', function (accounts) {
  const [creator, user, donor] = accounts
  const nobody = '0x0'
  let LC
  beforeEach(async () => (LC = await LeweyCoin.new(creator)))

  async function getNum (method, ...args) {
    const bigNumber = await LC[method](...args)
    return bigNumber.toNumber()
  }

  function fund (value) {
    LC.sendTransaction({ from: donor, value })
  }

  it('is created with the proper initial state', async function () {
    expect(await LC.owner()).to.eql(creator)
    expect(await getNum('balanceOf', creator)).to.eql(0)
    expect(await getNum('balanceOf', user)).to.eql(0)
    expect(balanceOf(LC.address)).to.eql(0)
    expect(await getNum('contractBalance')).to.eql(0)
  })

  describe('.contractBalance', function () {
    const subject = () => getNum('contractBalance')

    it('returns the expected balance', async function () {
      expect(await subject()).to.eql(0)
    })

    context('after funding', function () {
      beforeEach(async () => fund(0.1 * ETH))

      it('returns the expected balance', async function () {
        expect(await subject()).to.eql(0.1 * ETH)
        expect(balanceOf(LC.address)).to.eql(0.1 * ETH)
      })
    })
  })

  describe('funding the contract', function () {
    beforeEach(async () => fund(0.1 * ETH))

    it('does not change user balances', async function () {
      expect(await getNum('balanceOf', creator)).to.eql(0)
      expect(await getNum('balanceOf', user)).to.eql(0)
    })
  })

  describe('.ownerWithdraw', function () {
    let sender
    const subject = amount => LC.ownerWithdraw(amount, { from: sender })

    context('by non-owner', function () {
      beforeEach(() => (sender = user))

      it('fails', async function () {
        expect(await subject(0.05 * ETH)).to.fail()
      })
    })

    context('by creator', function () {
      beforeEach(() => (sender = creator))

      it('fails without funds', async function () {
        expect(await subject(0.05 * ETH)).to.fail()
      })

      context('after funding', function () {
        beforeEach(async () => fund(0.1 * ETH))

        it('succeeds, withdraws funds, and updates contract balance', async function () {
          expect(await subject(0.075 * ETH)).to.succeed()
          expect(await getNum('contractBalance')).to.eql(0.025 * ETH)
        })
      })
    })
  })

  describe('.kill', function () {
    let sender
    const subject = () => LC.kill({ from: sender })

    context('by non-owner', function () {
      beforeEach(() => (sender = user))

      it('fails', async function () {
        expect(await subject()).to.fail()
        expect(await LC.owner()).to.eql(creator)
      })
    })

    context('by creator', function () {
      beforeEach(() => (sender = creator))

      it('succeeds', async function () {
        expect(await subject()).to.succeed()
        expect(await LC.owner()).to.eql(nobody)
      })
    })
  })
})
