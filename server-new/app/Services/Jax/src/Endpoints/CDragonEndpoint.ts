import { JaxConfig } from '../../JaxConfig'
import CDragonRequest from '../CDragonRequest'

export default class CDragonEndpoint {
  private config: JaxConfig

  constructor (config: JaxConfig) {
    this.config = config
  }

  public champions () {
    return new CDragonRequest(this.config, 'champion-summary.json', 36000).execute()
  }

  public items () {
    return new CDragonRequest(this.config, 'items.json', 36000).execute()
  }

  public perks () {
    return new CDragonRequest(this.config, 'perks.json', 36000).execute()
  }

  public perkstyles () {
    return new CDragonRequest(this.config, 'perkstyles.json', 36000).execute()
  }

  public summonerSpells () {
    return new CDragonRequest(this.config, 'summoner-spells.json', 36000).execute()
  }
}
