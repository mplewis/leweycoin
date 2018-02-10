module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },
    rinkeby: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '4'
    },
    live: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '1'
    }
  }
}
