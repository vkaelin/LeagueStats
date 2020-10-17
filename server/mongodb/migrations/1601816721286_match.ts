import BaseMigration from '@ioc:Mongodb/Migration'

export default class MatchMigration extends BaseMigration {
  public up (): void {
    this.createCollection('matches')
    this.createIndex('matches', 'gameId')
    this.createIndex('matches', 'summoner_puuid')
  }
}
