'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Summoner extends Model {
  matches() {
    return this.hasMany('App/Models/Match', 'puuid', 'summoner_puuid')
  }
}

module.exports = Summoner
