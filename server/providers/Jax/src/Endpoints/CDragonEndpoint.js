const CDragonRequest = require('../CDragonRequest')

class CDragonEndpoint {
  items() {
    return new CDragonRequest('items.json').execute()
  }

  perks() {
    return new CDragonRequest('perks.json').execute()
  }

  perkstyles() {
    return new CDragonRequest('perkstyles.json').execute()
  }
}

module.exports = CDragonEndpoint
