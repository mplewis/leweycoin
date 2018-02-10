const ETH = 1000000000000000000 // wei
LeweyCoin.deployed().then(c => (LC = c))
web3.eth.getAccounts((_, a) => (addr = a[0]))

// let creator, user, donor
// web3.eth.getAccounts((_, a) => ([creator, user, donor] = a))
