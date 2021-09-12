import { MatchDto } from 'App/Services/Jax/src/Endpoints/MatchEndpoint'

class MatchParser {
  public async parseOneMatch(match: MatchDto) {
    // TODO: parse + store in database
    // From the MatchDto, we need these Models in the DB:
    // - 1x Match
    // - 10x MatchPlayer
    // - 2x MatchTeam
  }

  public async parse(matches: MatchDto[]) {
    // TODO
    // Loop on all matches and call .parse on it
  }
}

export default new MatchParser()
