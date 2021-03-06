const { ETH, TYPICAL_FEE, expect, balanceOf } = require('./spec_helper')

const LeweyCoin = artifacts.require('LeweyCoinMock')

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
    expect(await getNum('balanceFor', creator)).to.eql(0)
    expect(await getNum('balanceFor', user)).to.eql(0)
    expect(balanceOf(LC.address)).to.eql(0)
  })

  describe('funding the contract', function () {
    beforeEach(() => fund(0.1 * ETH))

    it('does not change user balances', async function () {
      expect(await getNum('balanceFor', creator)).to.eql(0)
      expect(await getNum('balanceFor', user)).to.eql(0)
    })
  })

  describe('.ownerWithdraw', function () {
    let sender
    const subject = () => LC.ownerWithdraw(0.075 * ETH, { from: sender })

    context('by non-owner', function () {
      beforeEach(() => (sender = user))

      it('fails', async function () {
        expect(await subject()).to.fail()
      })
    })

    context('by creator', function () {
      beforeEach(() => (sender = creator))

      it('fails without funds', async function () {
        expect(await subject()).to.fail()
      })

      context('after funding', function () {
        beforeEach(() => fund(0.1 * ETH))

        it('withdraws funds successfully', async function () {
          const previousBalance = balanceOf(creator)
          expect(await subject()).to.succeed()

          const expectedBalance = previousBalance + 0.075 * ETH
          expect(balanceOf(creator)).to.be.closeTo(expectedBalance, TYPICAL_FEE)

          expect(balanceOf(LC.address)).to.eql(0.025 * ETH)
        })
      })
    })
  })

  describe('.mint and .balanceFor', function () {
    let sender
    const subject = () => LC.mint(user, 0.1 * ETH, { from: sender })

    context('by non-owner', function () {
      beforeEach(() => (sender = user))

      it('fails', async function () {
        expect(await subject()).to.fail()
        expect(await getNum('balanceFor', user)).to.eql(0)
      })
    })

    context('by creator', function () {
      beforeEach(() => (sender = creator))

      it('succeeds and updates user balance', async function () {
        expect(await subject()).to.succeed()
        expect(await getNum('balanceFor', user)).to.eql(0.1 * ETH)
      })
    })
  })

  describe('.withdraw', function () {
    const subject = () => LC.withdraw({ from: user })

    context('with a fixed ETH exchange rate of 1 ETH = $2500', function () {
      const USD = 1 / 2500 * ETH
      beforeEach(() => LC.setNewExchangeRate(2500 * ETH))

      it('sends no ether when user balance is empty', async function () {
        const originalBalance = balanceOf(user)
        expect(await subject()).to.succeed()
        expect(balanceOf(user)).to.be.closeTo(originalBalance, TYPICAL_FEE)
      })

      context('after minting 10 LeweyCoins for user', function () {
        beforeEach(() => LC.mint(user, 10))

        it('fails when contract is underfunded', async function () {
          const originalBalance = balanceOf(user)
          expect(await subject()).to.fail()
          expect(balanceOf(user)).to.be.closeTo(originalBalance, TYPICAL_FEE)
        })

        context('after funding contract', function () {
          beforeEach(() => fund(100 * USD))

          it('succeeds, sends $10 in ether to user, and clears user balance', async function () {
            const originalBalance = balanceOf(user)
            expect(await subject()).to.succeed()

            const expectedBalance = originalBalance + 10 * USD
            expect(balanceOf(user)).to.be.closeTo(expectedBalance, TYPICAL_FEE)
            expect(balanceOf(LC.address)).to.eql(90 * USD)

            expect(await getNum('balanceFor', user)).to.eql(0)
          })
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
