import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import MatchService, { MatchListMode } from 'App/Services/MatchService'
import SummonerService from 'App/Services/SummonerService'

export default class LoadMatches extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'load:matches'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Load all possible matches for a given Summoner'

  @args.string({ description: 'Summoner name to search' })
  public summoner: string

  @args.string({ description: 'League region of the summoner' })
  public region: string

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: false,
  }

  public async run() {
    this.logger.info(`Trying to find ${this.summoner} from ${this.region}`)

    // ACCOUNT
    const account = await SummonerService.getSummoner(this.summoner, this.region)
    if (account) {
      this.logger.success('League account found.')
    } else {
      return this.logger.error('League account not found.')
    }

    // MATCHLIST
    const matchListIds = await MatchService.updateMatchList(
      account.puuid,
      this.region,
      MatchListMode.FIRSTIME
    )
    if (matchListIds.length) {
      this.logger.success(`${matchListIds.length} matches in the matchlist.`)
    } else {
      return this.logger.error('Matchlist empty.')
    }

    // MATCHES
    const chunkSize = 10
    let savedMatches = 0
    for (let i = 0; i < matchListIds.length; i += chunkSize) {
      const chunk = matchListIds.slice(i, i + chunkSize)
      savedMatches += (await MatchService.getMatches(this.region, chunk, account.puuid)).length
      this.logger.info(`${savedMatches} matches saved.`)
    }

    this.logger.success(`${savedMatches} matches saved for summoner ${this.summoner}.`)
  }
}
