import BaseMigration from '@ioc:Mongodb/Migration'

export default class SummonerMigration extends BaseMigration {
  public up (): void {
    // this.createCollection('summoners')
    this.createIndex('summoners', 'puuid')
  }
}
