import DDragonRequest from '../../DDragonRequest'

class DDragonVersionEndpoint {
  list() {
    return new DDragonRequest(
      `versions.json`,
      'api',
      null
    ).execute()
  }
}

export default DDragonVersionEndpoint
