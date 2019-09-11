const got = require('got')

class DDragonRequest {
  constructor(endpoint, type, version) {
    this.endpoint = endpoint
    this.type = type
    this.version = version

    this.lang = 'en_US'
  }

  // https://ddragon.leagueoflegends.com/cdn/${this.$patch}/data/en_US/champion.json
  // https://ddragon.leagueoflegends.com/api/versions.json

  async execute() {
    let url;
    if (this.version) {
      url = `https://ddragon.leagueoflegends.com/${this.type}/${this.version}/data/${this.lang}/${this.endpoint}`
    } else {
      url = `https://ddragon.leagueoflegends.com/${this.type}/${this.endpoint}`
    }

    try {
      const response = await got(url);
      return JSON.parse(response.body)
    } catch (error) {
      console.log(error.response.body);
    }
  }

}

module.exports = DDragonRequest
