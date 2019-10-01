'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SummonerSchema extends Schema {
  up () {
    this.create('summoners', (collection) => {
      collection.index('puuid', {puuid: 1})
    })
  }

  down () {
    this.drop('summoners')
  }
}

module.exports = SummonerSchema
