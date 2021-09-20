import Redis from '@ioc:Adonis/Addons/Redis'
import got from 'got/dist/source'

export interface ChampionsPlayRate {
  [champion: string]: {
    TOP: number
    JUNGLE: number
    MIDDLE: number
    BOTTOM: number
    UTILITY: number
  }
}

export interface RoleComposition {
  TOP?: number
  JUNGLE?: number
  MIDDLE?: number
  BOTTOM?: number
  UTILITY?: number
}

export interface ChampionComposition {
  [champion: number]: number
}

export interface ApiRoleResponse {
  data: { [key: string]: ChampionInitialRates }
  patch: string
}

export interface ChampionInitialRates {
  MIDDLE?: RoleRate
  UTILITY?: RoleRate
  JUNGLE?: RoleRate
  TOP?: RoleRate
  BOTTOM?: RoleRate
}

export interface RoleRate {
  playRate: number
  winRate: number
  banRate: number
}

export interface ChampionsRates {
  [champion: number]: RoleComposition
}

class RoleIdentificationService {
  private _getPermutations(array: number[]) {
    const result: number[][] = []

    for (let i = 0; i < array.length; i++) {
      const rest = this._getPermutations(array.slice(0, i).concat(array.slice(i + 1)))

      if (!rest.length) {
        result.push([array[i]])
      } else {
        for (let j = 0; j < rest.length; j++) {
          result.push([array[i]].concat(rest[j]))
        }
      }
    }
    return result
  }

  private _calculateMetric(championPositions: ChampionsRates, bestPositions: RoleComposition) {
    return (
      Object.entries(bestPositions).reduce((agg, [position, champion]) => {
        return agg + (championPositions[champion][position] || 0)
      }, 0) / Object.keys(bestPositions).length
    )
  }

  private _getPositions(
    championPositions: ChampionsRates,
    composition: number[],
    top?: number,
    jungle?: number,
    middle?: number,
    adc?: number,
    support?: number
  ) {
    // Set the initial guess to be the champion in the composition, order doesn't matter
    let bestPositions: RoleComposition = {
      TOP: composition[0],
      JUNGLE: composition[1],
      MIDDLE: composition[2],
      BOTTOM: composition[3],
      UTILITY: composition[4],
    }

    let bestMetric = this._calculateMetric(championPositions, bestPositions)
    let secondBestMetric = -Infinity
    let secondBestPositions: RoleComposition | null = null

    // Figure out which champions and positions we need to fill
    const knownChampions = [top, jungle, middle, adc, support].filter(Boolean)
    const unknownChampions = composition.filter((champ) => !knownChampions.includes(champ))
    const unknownPositions = Object.entries({
      TOP: top,
      JUNGLE: jungle,
      MIDDLE: middle,
      BOTTOM: adc,
      UTILITY: support,
    })
      .filter((pos) => !pos[1])
      .map((pos) => pos[0])

    const testComposition: RoleComposition = {
      TOP: top,
      JUNGLE: jungle,
      MIDDLE: middle,
      BOTTOM: adc,
      UTILITY: support,
    }

    // Iterate over the positions we need to fill and record how well each composition "performs"
    for (const champs of this._getPermutations(unknownChampions)) {
      for (let [i, position] of unknownPositions.entries()) {
        testComposition[position] = champs[i]
      }

      const metric = this._calculateMetric(championPositions, testComposition)

      if (metric > bestMetric) {
        secondBestMetric = bestMetric
        secondBestPositions = bestPositions
        bestMetric = metric
        bestPositions = { ...testComposition }
      }

      if (bestMetric > metric && metric > secondBestMetric) {
        secondBestMetric = metric
        secondBestPositions = { ...testComposition }
      }
    }

    const bestPlayPercents: ChampionComposition = {}
    for (const [position, champion] of Object.entries(bestPositions)) {
      bestPlayPercents[champion] = championPositions[champion][position]
    }

    let secondBestPlayPercents: ChampionComposition | null = null
    if (secondBestPositions !== null) {
      secondBestPlayPercents = {}
      for (const [position, champion] of Object.entries(secondBestPositions)) {
        secondBestPlayPercents[champion] = championPositions[champion][position]
      }
    }

    if (JSON.stringify(secondBestPositions) === JSON.stringify(bestPositions)) {
      secondBestPositions = null
      secondBestPlayPercents = null
      secondBestMetric = -Infinity
    }

    return { bestPositions, bestMetric, secondBestPositions }
  }

  /**
   * Get the CDN data of the champion playrates by role
   */
  public async pullData(): Promise<ChampionsPlayRate> {
    const url = 'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/championrates.json'

    // Check if cached
    const requestCached = await Redis.get(url)
    if (requestCached) {
      return JSON.parse(requestCached)
    }

    const data = {}
    const { body }: { body: ApiRoleResponse } = await got(url, { responseType: 'json' })

    for (const [championId, roles] of Object.entries(body.data)) {
      const playRates = {}

      for (const [position, rates] of Object.entries(roles)) {
        playRates[position.toUpperCase()] = rates['playRate']
      }

      for (const position of ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']) {
        if (playRates[position] === undefined) {
          playRates[position] = 0
        }
      }

      data[championId] = playRates
    }

    // Cache result
    await Redis.set(url, JSON.stringify(data), 'EX', 36000)

    return data
  }

  /**
   * Get roles for the 5 players of a team
   * @param championPositions
   * @param composition
   * @param jungle
   * @param support
   */
  public getRoles(
    championPositions: ChampionsRates,
    composition: number[],
    jungle?: number,
    support?: number
  ): RoleComposition {
    // Set composition champion playrate to 0% if not present in the json data
    for (const compChamp of composition) {
      if (championPositions[compChamp]) {
        continue
      }

      championPositions[compChamp] = {
        MIDDLE: 0,
        UTILITY: 0,
        TOP: 0,
        JUNGLE: 0,
        BOTTOM: 0,
      }
    }

    const identified: RoleComposition = {}
    let positions: RoleComposition = {}
    let secondaryPositions: RoleComposition | null = null
    let secondaryMetric = -Infinity

    if (jungle) {
      identified['JUNGLE'] = jungle
    }

    if (support) {
      identified['UTILITY'] = support
    }

    while (Object.keys(identified).length < composition.length - 1) {
      let {
        bestPositions,
        bestMetric: metric,
        secondBestPositions: sbp,
      } = this._getPositions(
        championPositions,
        composition,
        identified.TOP,
        identified.JUNGLE,
        identified.MIDDLE,
        identified.BOTTOM,
        identified.UTILITY
      )

      positions = bestPositions

      if (sbp !== null) {
        let currentMetric = this._calculateMetric(championPositions, { ...sbp })

        if (secondaryPositions === null) {
          secondaryPositions = sbp
          secondaryMetric = currentMetric
        } else if (metric > currentMetric && currentMetric > secondaryMetric) {
          secondaryMetric = currentMetric
          secondaryPositions = sbp
        }
      }

      // Done! Grab the results.
      const positionsWithMetric = {}
      for (const [position, champion] of Object.entries(positions)) {
        if (
          Object.keys(identified).includes(position) ||
          champion === jungle ||
          champion === support
        ) {
          continue
        }
        positionsWithMetric[position] = {
          champion,
          metric: championPositions[champion][position],
        }
      }

      // TODO: Tmp fix
      if (!Object.keys(positionsWithMetric).length) {
        jungle = undefined
        support = undefined
        continue
      }

      const bestPosition = Object.keys(positionsWithMetric).reduce((posA, posB) => {
        return positionsWithMetric[posA].metric > positionsWithMetric[posB].metric ? posA : posB
      })

      const best = [bestPosition, positionsWithMetric[bestPosition].champion]
      identified[best[0]] = best[1]
    }

    return positions
  }
}

export default new RoleIdentificationService()
