import { PlayerRole } from 'App/helpers'
import MatchPlayer from 'App/Models/MatchPlayer'
import MatchPlayerRank from 'App/Models/MatchPlayerRank'
import { PlayerRankParsed, TeamPosition } from 'App/Parsers/ParsedType'
import CDragonService from 'App/Services/CDragonService'
import RoleIdentificationService, { RoleComposition } from 'App/Services/RoleIdentificationService'
import SummonerService from 'App/Services/SummonerService'
import {
  SerializedBasePlayer,
  SerializedMatchChampion,
  SerializedMatchItem,
  SerializedMatchPerks,
  SerializedMatchSummonerSpell,
} from './SerializedTypes'

export default abstract class MatchSerializer {
  /**
   * Get champion specific data
   * @param id of the champion
   */
  public getChampion(id: number): SerializedMatchChampion {
    const originalChampionData = CDragonService.champions[id]
    const icon = CDragonService.createAssetUrl(originalChampionData.squarePortraitPath)

    return {
      icon,
      id: originalChampionData.id,
      name: originalChampionData.name,
      alias: originalChampionData.alias,
      roles: originalChampionData.roles,
    }
  }
  /**
   * Get Summoner Spell Data from CDragon
   * @param id of the summonerSpell
   */
  public getSummonerSpell(id: number): SerializedMatchSummonerSpell | null {
    const spell = CDragonService.summonerSpells[id]
    if (id === 0 || !spell) {
      return null
    }
    return {
      name: spell.name,
      description: spell.description,
      icon: CDragonService.createAssetUrl(spell.iconPath),
    }
  }

  protected getItems(player: MatchPlayer): Array<SerializedMatchItem | null> {
    const items: (SerializedMatchItem | null)[] = []
    for (let i = 0; i < 6; i++) {
      const id = player['item' + i]
      if (id === 0) {
        items.push(null)
        continue
      }

      const item = CDragonService.items[id]
      if (!item) {
        items.push(null)
        continue
      }

      items.push({
        image: CDragonService.createAssetUrl(item.iconPath),
        name: item.name,
        description: item.description,
        price: item.priceTotal,
      })
    }
    return items
  }

  protected getPerks(player: MatchPlayer): SerializedMatchPerks {
    return {
      primaryStyle: player.perksPrimaryStyle,
      secondaryStyle: player.perksSecondaryStyle,
      selected: player.perksSelected,
    }
  }

  protected getRuneIcons(perksSelected: number[], perksSecondaryStyle: number) {
    const primaryRune = perksSelected.length ? CDragonService.perks[perksSelected[0]] : null
    const secondaryRune = CDragonService.perkstyles[perksSecondaryStyle]

    return {
      primaryRune: primaryRune ? CDragonService.createAssetUrl(primaryRune.iconPath) : null,
      secondaryRune: secondaryRune ? CDragonService.createAssetUrl(secondaryRune.iconPath) : null,
    }
  }

  protected getPlayerBase(player: MatchPlayer): SerializedBasePlayer {
    return {
      champion: this.getChampion(player.championId),
      items: this.getItems(player),
      level: player.champLevel,
      name: player.summonerName,
      perks: this.getPerks(player),
      role: TeamPosition[player.teamPosition],
      summonerId: player.summonerId,
      summonerPuuid: player.summonerPuuid,
      summonerSpell1: this.getSummonerSpell(player.summoner1Id),
      summonerSpell2: this.getSummonerSpell(player.summoner2Id),
    }
  }

  protected getPlayerRank(rank: PlayerRankParsed | MatchPlayerRank) {
    return {
      tier: rank.tier,
      rank: rank.rank,
      lp: rank.lp,
      wins: rank.wins,
      losses: rank.losses,
      shortName: SummonerService.getRankedShortName(rank),
    }
  }

  /**
   * Return the 5 roles of a team based on champions
   * @param team 5 champions + smite from a team
   */
  protected getTeamRoles(team: PlayerRole[]): RoleComposition {
    const teamJunglers = team.filter((p) => p.jungle && !p.support)
    const jungle = teamJunglers.length === 1 ? teamJunglers[0].champion : undefined
    const teamSupports = team.filter((p) => p.support && !p.jungle)
    const support = teamSupports.length === 1 ? teamSupports[0].champion : undefined

    return RoleIdentificationService.getRoles(
      CDragonService.championRoles,
      team.map((p) => p.champion),
      jungle,
      support
    )
  }
}
