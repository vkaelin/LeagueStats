const CDragonRequest = require('../CDragonRequest')

class CDragonEndpoint {
  constructor(config) {
    this.config = config
  }

  champions() {
    return new CDragonRequest(this.config, 'champion-summary.json', 36000).execute()
  }

  items() {
    return new CDragonRequest(this.config, 'items.json', 36000).execute()
  }

  perks() {
    return new CDragonRequest(this.config, 'perks.json', 36000).execute()
  }

  perkstyles() {
    return new CDragonRequest(this.config, 'perkstyles.json', 36000).execute()
  }

  summonerSpells() {
    return new CDragonRequest(this.config, 'summoner-spells.json', 36000).execute()
  }
}

module.exports = CDragonEndpoint
