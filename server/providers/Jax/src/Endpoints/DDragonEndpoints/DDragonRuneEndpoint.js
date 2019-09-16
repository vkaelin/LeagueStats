const DDragonRequest = require('../../DDragonRequest')

class DDragonRuneEndpoint {
  constructor(version) {
    this.version = version
  }

  list() {
    return new DDragonRequest(
      `runesReforged.json`,
      'cdn',
      this.version
    ).execute()
  }
}

module.exports = DDragonRuneEndpoint
