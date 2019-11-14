const DDragonRequest = require('../../DDragonRequest')

class DDragonItemEndpoint {
  constructor(version) {
    this.version = version
  }

  list() {
    return new DDragonRequest(
      `item.json`,
      'cdn',
      this.version
    ).execute()
  }
}

module.exports = DDragonItemEndpoint
