import { TaskContract } from '@ioc:StouderIO/Scheduler'
import CDragonService from 'App/Services/CDragonService'

export default class UpdateCDragonCache implements TaskContract {
  public readonly name: string = 'UpdateCDragonCache'
  public readonly cron: string = '*/30 * * * *' // every 30 minutes

  public async run(): Promise<void> {
    await CDragonService.getContext()
  }
}
