const got = require('got')
const Redis = use('Redis')

class CDragonRequest {
  constructor(endpoint, cacheTime) {
    this.endpoint = endpoint
    this.cacheTime = cacheTime
  }

  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json
  // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json

  async execute() {
    const url = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${this.endpoint}`

    const requestCached = await Redis.get(url)
    if (requestCached) {
      return JSON.parse(requestCached)
    }

    try {
      const response = await got(url);

      await Redis.set(url, response.body, 'EX', this.cacheTime)
      return JSON.parse(response.body)
    } catch (error) {
      console.log(error.response.body);
    }
  }

}

module.exports = CDragonRequest
