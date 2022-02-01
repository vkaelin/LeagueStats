import { JobContract } from '@ioc:Rocketseat/Bull'
import MatchService, { MatchListMode } from 'App/Services/MatchService'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export interface FetchMatchListArgs {
  puuid: string
  region: string
  mode: MatchListMode
}

export default class FetchMatchList implements JobContract {
  public key = 'FetchMatchList'

  public async handle(job) {
    const { data }: { data: FetchMatchListArgs } = job

    // Load entire matchlist in DB if it's first time or update it
    await MatchService.updateMatchList(data.puuid, data.region, data.mode)
  }
}
