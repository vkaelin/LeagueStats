import LeagueEndpoint from './Endpoints/LeagueEndpoint'
import MatchEndpoint from './Endpoints/MatchEndpoint'
import MatchlistEndpoint from './Endpoints/MatchlistEndpoint'
import SummonerEndpoint from './Endpoints/SummonerEndpoint'
import SpectatorEndpoint from './Endpoints/SpectatorEndpoint'
import CDragonEndpoint from './Endpoints/CDragonEndpoint'
import { JaxConfig } from '../JaxConfig'
// import { RiotRateLimiter } from '@fightmegg/riot-rate-limiter'
import RiotRateLimiter from 'riot-ratelimiter'
import { STRATEGY } from 'riot-ratelimiter/dist/RateLimiter'
import MatchV4Endpoint from './Endpoints/MatchV4Endpoint'
import MatchlistV4Endpoint from './Endpoints/MatchlistV4Endpoint'

export default class Jax {
  public key: string
  public limiter: RiotRateLimiter
  public config: JaxConfig
  public League: LeagueEndpoint
  public Match: MatchEndpoint
  public MatchV4: MatchV4Endpoint
  public Matchlist: MatchlistEndpoint
  public MatchlistV4: MatchlistV4Endpoint
  public Spectator: SpectatorEndpoint
  public Summoner: SummonerEndpoint
  public CDragon: CDragonEndpoint

  constructor(config: JaxConfig) {
    this.key = config.key
    // this.limiter = new RiotRateLimiter({
    //   debug: true,
    //   retryCount: 0,
    // })
    this.limiter = new RiotRateLimiter({
      debug: false,
      strategy: STRATEGY.SPREAD,
    })
    this.config = config

    this.League = new LeagueEndpoint(this.config, this.limiter)
    this.Match = new MatchEndpoint(this.config, this.limiter)
    this.MatchV4 = new MatchV4Endpoint(this.config, this.limiter)
    this.Matchlist = new MatchlistEndpoint(this.config, this.limiter)
    this.MatchlistV4 = new MatchlistV4Endpoint(this.config, this.limiter)
    this.Spectator = new SpectatorEndpoint(this.config, this.limiter)
    this.Summoner = new SummonerEndpoint(this.config, this.limiter)
    this.CDragon = new CDragonEndpoint(this.config)
  }
}
