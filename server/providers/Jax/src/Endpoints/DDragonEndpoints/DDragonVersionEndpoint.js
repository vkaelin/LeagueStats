const DDragonRequest = require('../../DDragonRequest')

class DDragonVersionEndpoint {
  list() {
    return new DDragonRequest(
      `versions.json`,
      'api',
      null
    ).execute()
  }
}

module.exports = DDragonVersionEndpoint
