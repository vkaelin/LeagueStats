'use strict'

const got = require('got')
const Redis = use('Redis')

class RoleIdentificationService {
  _getPermutations(array) {
    const result = []

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

  _calculateMetric(championPositions, bestPositions) {
    return Object.entries(bestPositions).reduce((agg, [position, champion]) => {
      return agg + (championPositions[champion][position] || 0)
    }, 0) / Object.keys(bestPositions).length
  }

  _getPositions(championPositions, composition, top, jungle, middle, adc, support) {
    // Set the initial guess to be the champion in the composition, order doesn't matter
    let bestPositions = {
      'TOP': composition[0],
      'JUNGLE': composition[1],
      'MIDDLE': composition[2],
      'BOTTOM': composition[3],
      'UTILITY': composition[4],
    }

    let bestMetric = this._calculateMetric(championPositions, bestPositions)
    let secondBestMetric = -Infinity
    let secondBestPositions = null

    // Figure out which champions and positions we need to fill
    const knownChampions = [top, jungle, middle, adc, support].filter(Boolean)
    const unknownChampions = composition.filter(champ => !knownChampions.includes(champ))
    const unknownPositions = Object.entries({
      'TOP': top, 'JUNGLE': jungle, 'MIDDLE': middle, 'BOTTOM': adc, 'UTILITY': support,
    })
      .filter(pos => !pos[1])
      .map(pos => pos[0])

    const testComposition = {
      'TOP': top,
      'JUNGLE': jungle,
      'MIDDLE': middle,
      'BOTTOM': adc,
      'UTILITY': support,
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

    const bestPlayPercents = {}
    for (const [position, champion] of Object.entries(bestPositions)) {
      bestPlayPercents[champion] = championPositions[champion][position]
    }

    let secondBestPlayPercents = null
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
  async pullData() {
    const url = 'http://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/championrates.json'

    // Check if cached
    const requestCached = await Redis.get(url)
    if (requestCached) {
      return JSON.parse(requestCached)
    }

    const data = {}
    const response = await got(url, { responseType: 'json' })

    for (const [championId, roles] of Object.entries(response.body.data)) {
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
  getRoles(championPositions, composition, jungle = null, support = null) {
    const identified = {}
    let positions = {}
    let secondaryPositions = null
    let secondaryMetric = -Infinity

    if (jungle) {
      identified['JUNGLE'] = jungle
    }

    if (support) {
      identified['UTILITY'] = support
    }

    while (Object.keys(identified).length < composition.length - 1) {
      let { bestPositions, bestMetric: metric, secondBestPositions: sbp } =
        this._getPositions(championPositions, composition,
          identified.TOP, identified.JUNGLE, identified.MIDDLE, identified.ADC, identified.UTILITY
        )

      positions = bestPositions

      if (sbp !== null) {
        let _metric = this._calculateMetric(championPositions, { ...sbp })

        if (secondaryPositions === null) {
          secondaryPositions = sbp
          secondaryMetric = _metric
        } else if (metric > _metric && _metric > secondaryMetric) {
          secondaryMetric = _metric
          secondaryPositions = sbp
        }
      }

      // Done! Grab the results.
      const positionsWithMetric = {}
      for (const [position, champion] of Object.entries(positions)) {
        if (Object.keys(identified).includes(position)) {
          continue
        }
        positionsWithMetric[position] = {
          champion,
          metric: championPositions[champion][position],
        }
      }
      const bestPosition = Object.keys(positionsWithMetric).reduce((posA, posB) => {
        return positionsWithMetric[posA].metric > positionsWithMetric[posB].metric ? posA : posB
      })

      const best = [bestPosition, positionsWithMetric[bestPosition].champion]
      identified[best[0]] = best[1]
    }

    // Rename UTILITY to SUPPORT
    const {
      UTILITY: SUPPORT,
      ...rest
    } = positions

    return { ...rest, SUPPORT }
  }
}

module.exports = new RoleIdentificationService()
