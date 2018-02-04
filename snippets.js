LeweyCoin.deployed().then(c => (LC = c))
const ETH = 1000000000000000000 // wei
let creator, user, donor
web3.eth.getAccounts((_, a) => ([creator, user, donor] = a))
