import Redis from '@ioc:Adonis/Addons/Redis'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RuneSerializer from 'App/Serializers/RuneSerializer'
import Jax from 'App/Services/Jax'

export default class CDragonController {
  public async runes({ response }: HttpContextContract) {
    const cacheUrl = 'cdragon-runes'

    const requestCached = await Redis.get(cacheUrl)
    if (requestCached) {
      return response.json(requestCached)
    }

    const perks = await Jax.CDragon.perks()
    const perkstyles = await Jax.CDragon.perkstyles()

    const runesData = {
      perks: RuneSerializer.serializePerks(perks),
      perkstyles: RuneSerializer.serializeStyles(perkstyles.styles),
    }

    await Redis.set(cacheUrl, JSON.stringify(runesData), 'EX', 36000)

    return response.json(runesData)
  }
}
