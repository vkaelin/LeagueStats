import DDragonRequest from '../../DDragonRequest'

class DDragonChampionEndpoint {
  constructor(version) {
    this.version = version
  }

  list() {
    return new DDragonRequest(
      `champion.json`,
      'cdn',
      this.version
    ).execute()
  }
}

export default DDragonChampionEndpoint
