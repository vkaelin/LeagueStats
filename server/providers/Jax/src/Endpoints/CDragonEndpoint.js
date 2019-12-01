const CDragonRequest = require('../CDragonRequest')

class CDragonEndpoint {
  champions() {
    return new CDragonRequest('champion-summary.json').execute()
  }

  items() {
    return new CDragonRequest('items.json').execute()
  }

  perks() {
    return new CDragonRequest('perks.json').execute()
  }

  perkstyles() {
    return new CDragonRequest('perkstyles.json').execute()
  }

  summonerSpells() {
    return new CDragonRequest('summoner-spells.json').execute()
  }
}

module.exports = CDragonEndpoint
