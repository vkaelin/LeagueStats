import { JaxConfig } from '../../JaxConfig'
import CDragonRequest from '../CDragonRequest'

export interface ChampionDTO {
  id: number
  name: string
  alias: string
  squarePortraitPath: string
  roles: string[]
}

export interface ItemDTO {
  id: number
  name: string
  description: string
  active: boolean
  inStore: boolean
  from: number[]
  to: number[]
  categories: string[]
  mapStringIdInclusions: string[]
  maxStacks: number
  modeNameInclusions: string[]
  requiredChampion: string
  requiredAlly: string
  requiredBuffCurrencyName: string
  requiredBuffCurrencyCost: number
  specialRecipe: number
  isEnchantment: boolean
  price: number
  priceTotal: number
  iconPath: string
}

export interface PerkDTO {
  id: number
  name: string
  majorChangePatchVersion: string
  tooltip: string
  shortDesc: string
  longDesc: string
  iconPath: string
  endOfGameStatDescs: string[]
}

export interface PerkStyleResponse {
  schemaVersion: string
  styles: PerkStyleDTO[]
}

export interface PerkStyleDTO {
  id: number
  name: string
  tooltip: string
  iconPath: string
  assetMap: { [key: string]: string }
  isAdvanced: boolean
  allowedSubStyles: number[]
  subStyleBonus: { styleId: number; perkId: number }[]
  slots: { type: string; slotLabel: string; perks: number[] }[]
  defaultPageName: string
  defaultSubStyle: number
  defaultPerks: number[]
  defaultPerksWhenSplashed: number[]
  defaultStatModsPerSubStyle: { id: string; perks: number[] }[]
}

export interface SummonerSpellDTO {
  id: number
  name: string
  description: string
  summonerLevel: number
  cooldown: number
  gameModes: string[]
  iconPath: string
}

export default class CDragonEndpoint {
  private config: JaxConfig

  constructor(config: JaxConfig) {
    this.config = config
  }

  public async champions(): Promise<ChampionDTO[]> {
    return new CDragonRequest(this.config, 'champion-summary.json', 36000).execute()
  }

  public async items(): Promise<ItemDTO[]> {
    return new CDragonRequest(this.config, 'items.json', 36000).execute()
  }

  public async perks(): Promise<PerkDTO[]> {
    return new CDragonRequest(this.config, 'perks.json', 36000).execute()
  }

  public async perkstyles(): Promise<PerkStyleResponse> {
    return new CDragonRequest(this.config, 'perkstyles.json', 36000).execute()
  }

  public async summonerSpells(): Promise<SummonerSpellDTO[]> {
    return new CDragonRequest(this.config, 'summoner-spells.json', 36000).execute()
  }
}
