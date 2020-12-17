import Redis from '@ioc:Adonis/Addons/Redis'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Jax from 'App/Services/Jax'
import RuneTransformer from 'App/Transformers/RuneTransformer'

export default class CDragonController {
  public async runes ({ response }: HttpContextContract) {
    const cacheUrl = 'cdragon-runes'

    const requestCached = await Redis.get(cacheUrl)
    if (requestCached) {
      return response.json(requestCached)
    }

    const perks = await Jax.CDragon.perks()
    const perkstyles = await Jax.CDragon.perkstyles()

    const runesData = {
      perks: RuneTransformer.transformPerks(perks),
      perkstyles: RuneTransformer.transformStyles(perkstyles.styles),
    }

    await Redis.set(cacheUrl, JSON.stringify(runesData), 'EX', 36000)

    return response.json(runesData)
  }
}
