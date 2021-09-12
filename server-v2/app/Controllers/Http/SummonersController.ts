import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SummonerBasicValidator from 'App/Validators/SummonerBasicValidator'

export default class SummonersController {
  public async basic({ request, response }: HttpContextContract) {
    const { summoner, region } = await request.validate(SummonerBasicValidator)
    return response.json('BASIC REQUEST from ' + summoner + ' - ' + region)
  }

  public async overview({ response }: HttpContextContract) {
    return response.json('OVERVIEW REQUEST')
  }
}
