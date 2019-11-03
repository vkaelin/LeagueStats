'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DetailedMatchSchema extends Schema {
  up () {
    this.create('detailed_matches', (collection) => {
      collection.index('gameId', {gameId: 1})
    })
  }

  down () {
    this.drop('detailed_matches')
  }
}

module.exports = DetailedMatchSchema
