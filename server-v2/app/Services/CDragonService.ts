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

class CDragonService {
  public champions: ChampionDTO[]
  public items: ItemDTO[]
  public perks: PerkDTO[]
  public perkstyles: PerkStyleDTO[]
  public summonerSpells: SummonerSpellDTO[]
  public championRoles: ChampionsPlayRate

  /**
   * Get global Context with CDragon Data
   */
  public async getContext() {
    if (this.champions) {
      return
    }

    const items = await Jax.CDragon.items()
    const champions = await Jax.CDragon.champions()
    const perks = await Jax.CDragon.perks()
    const perkstyles = await Jax.CDragon.perkstyles()
    const summonerSpells = await Jax.CDragon.summonerSpells()
    const championRoles = await RoleIdentificationService.pullData().catch(() => {})

    this.champions = champions
    this.items = items
    this.perks = perks
    this.perkstyles = perkstyles.styles
    this.summonerSpells = summonerSpells
    this.championRoles = championRoles as ChampionsPlayRate
  }
}

export default new CDragonService()
