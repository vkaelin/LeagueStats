'use strict'

const Jax = use('Jax')

class DDragonController {
  /**
   *  POST - Return infos about all static Ddragon data
   */
  async index({ request, response }) {
    console.log('DDragon Request')
    const endpoint = request.input('endpoint')
    const result = await Jax.DDragon[endpoint].list()
    response.json(result)
  }
}

module.exports = DDragonController
