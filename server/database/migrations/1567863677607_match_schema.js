'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema') 

class MatchSchema extends Schema {
  up () {
    this.create('matches', (collection) => {
      collection.index('gameId', {gameId: 1})
    })
  }

  down () {
    this.drop('matches')
  }
}

module.exports = MatchSchema
