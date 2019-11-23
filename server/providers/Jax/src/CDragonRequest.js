const got = require('got')

class CDragonRequest {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json

  async execute() {
    let url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${this.endpoint}`

    try {
      const response = await got(url);
      return JSON.parse(response.body)
    } catch (error) {
      console.log(error.response.body);
    }
  }

}

module.exports = CDragonRequest
