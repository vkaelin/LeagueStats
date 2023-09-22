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

  private setupCache<T extends Identifiable>(key: string, dto: T[]) {
    if (dto.length === 0) return

    this[key] = dto.reduce((obj, item) => ((obj[item.id] = item), obj), {})
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
    const [items, champions, perks, perkstyles, summonerSpells, championRoles] = await Promise.all([
      Jax.CDragon.items(),
      Jax.CDragon.champions(),
      Jax.CDragon.perks(),
      Jax.CDragon.perkstyles(),
      Jax.CDragon.summonerSpells(),
      RoleIdentificationService.pullData().catch(() => {}),
    ])

    this.setupCache('champions', champions)
    this.setupCache('items', items)
    this.setupCache('perks', perks)
    this.setupCache('perkstyles', perkstyles.styles)
    this.setupCache('summonerSpells', summonerSpells)
    if (championRoles) {
      this.championRoles = championRoles
    }
  }
}

export default new CDragonService()
