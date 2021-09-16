import Jax from 'App/Services/Jax'
import {
  ChampionDTO,
  ItemDTO,
  PerkDTO,
  PerkStyleDTO,
  SummonerSpellDTO,
} from 'App/Services/Jax/src/Endpoints/CDragonEndpoint'
import RoleIdentificationService, {
  ChampionsPlayRate,
} from 'App/Services/RoleIdentificationService'

interface Identifiable {
  id: number
}

export interface CDragonCache<T> {
  [id: string]: T
}

class CDragonService {
  public champions: CDragonCache<ChampionDTO>
  public items: CDragonCache<ItemDTO>
  public perks: CDragonCache<PerkDTO>
  public perkstyles: CDragonCache<PerkStyleDTO>
  public summonerSpells: CDragonCache<SummonerSpellDTO>
  public championRoles: ChampionsPlayRate

  public readonly BASE_URL =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/'

  private setupCache<T extends Identifiable>(dto: T[]) {
    return dto.reduce((obj, item) => ((obj[item.id] = item), obj), {})
  }

  /**
   *  Give the full CDragon image path from the iconPath field
   */
  public createAssetUrl(iconPath: string) {
    const name = iconPath.split('/assets/')[1].toLowerCase()
    return `${this.BASE_URL}${name}`
  }

  /**
   * Get global Context with CDragon Data
   */
  public async getContext() {
    const items = await Jax.CDragon.items()
    const champions = await Jax.CDragon.champions()
    const perks = await Jax.CDragon.perks()
    const perkstyles = await Jax.CDragon.perkstyles()
    const summonerSpells = await Jax.CDragon.summonerSpells()
    const championRoles = await RoleIdentificationService.pullData().catch(() => {})

    this.champions = this.setupCache(champions)
    this.items = this.setupCache(items)
    this.perks = this.setupCache(perks)
    this.perkstyles = this.setupCache(perkstyles.styles)
    this.summonerSpells = this.setupCache(summonerSpells)
    this.championRoles = championRoles as ChampionsPlayRate
  }
}

export default new CDragonService()
