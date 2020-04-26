const CDragonRequest = require('../CDragonRequest')

class CDragonEndpoint {
  champions() {
    return new CDragonRequest('champion-summary.json', 36000).execute()
  }

  items() {
    return new CDragonRequest('items.json', 36000).execute()
  }

  perks() {
    return new CDragonRequest('perks.json', 36000).execute()
  }

  perkstyles() {
    return new CDragonRequest('perkstyles.json', 36000).execute()
  }

  summonerSpells() {
    return new CDragonRequest('summoner-spells.json', 36000).execute()
  }
}

module.exports = CDragonEndpoint
