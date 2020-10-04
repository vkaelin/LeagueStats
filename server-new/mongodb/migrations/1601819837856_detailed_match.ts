import BaseMigration from '@ioc:Mongodb/Migration'

export default class DetailedMatchMigration extends BaseMigration {
  public up (): void {
    // this.createCollection('detailed_matches')
    this.createIndex('detailed_matches', 'gameId')
  }
}
