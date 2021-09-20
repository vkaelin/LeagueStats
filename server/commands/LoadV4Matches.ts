import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import MatchV4Service from 'App/Services/MatchV4Service'
import SummonerService from 'App/Services/SummonerService'

export default class LoadV4Matches extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'load:v4'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Load matches for a given Summoner from the old Match-V4 endpoint'

  @args.string({ description: 'Summoner name to seach' })
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
    const account = await SummonerService.getAccount(this.summoner, this.region)
    if (account) {
      this.logger.success('League account found.')
    } else {
      return this.logger.error('League account not found.')
    }

    // MATCHLIST
    const matchListIds = await MatchV4Service.updateMatchList(account, this.region)
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
      savedMatches += await MatchV4Service.getMatches(this.region, chunk)
      this.logger.info(`${savedMatches} matches saved.`)
    }

    this.logger.success(`${savedMatches} matches saved for summoner ${this.summoner}.`)
  }
}
