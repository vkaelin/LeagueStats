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

export default abstract class MatchSerializer {
  protected champions: ChampionDTO[]
  protected items: ItemDTO[]
  protected perks: PerkDTO[]
  protected perkstyles: PerkStyleDTO[]
  protected summonerSpells: SummonerSpellDTO[]
  protected championRoles: ChampionsPlayRate

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

    this.champions = champions
    this.items = items
    this.perks = perks
    this.perkstyles = perkstyles.styles
    this.summonerSpells = summonerSpells
    this.championRoles = championRoles as ChampionsPlayRate
  }
}
