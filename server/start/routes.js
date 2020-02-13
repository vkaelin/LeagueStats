'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const Match = use('App/Models/Match')

Route.get('/', async () => {
  return {
    greeting: 'Hello world from LeagueStats.gg',
    match: await Match.first()
  }
})

Route.post('/summoner/basic', 'SummonerController.basic')
Route.post('/summoner/overview', 'SummonerController.overview')
Route.post('/summoner/champions', 'SummonerController.champions')
Route.post('/summoner/records', 'SummonerController.records')
Route.post('/summoner/live', 'SummonerController.liveMatchDetails')
Route.post('/match', 'MatchController.index')
Route.post('/match/details', 'MatchController.show')
Route.post('/match/details/ranks', 'MatchController.showRanks')
