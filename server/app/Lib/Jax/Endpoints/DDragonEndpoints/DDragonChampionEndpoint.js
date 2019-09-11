const DDragonRequest = require('../../DDragonRequest')

class DDragonChampionEndpoint {
  constructor(version) {
    this.version = version
  }

  list() {
    return new DDragonRequest(
      `champion.json`,
      'cdn',
      this.version
    ).execute()
  }
}

module.exports = DDragonChampionEndpoint
