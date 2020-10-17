/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import mongodb from '@ioc:Mongodb/Database'
import Jax from 'App/Services/Jax'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('mongo', async () => {
  const match = await (await mongodb.connection().collection('matches')).findOne({})
  return { test: match }
})

Route.get('jax', async () => {
  const summoner = await Jax.Summoner.summonerName('LeagueStats GG', 'euw1')
  return { player: summoner }
})

Route.get('test', async () => {
  const summonersCollection = await mongodb.connection().collection('summoners')
  const summonerDB = await summonersCollection.findOne({ puuid: 1234 })

  return { player: summonerDB }
})

Route.post('/summoner/basic', 'SummonersController.basic')
Route.post('/summoner/overview', 'SummonersController.overview')
Route.post('/summoner/champions', 'SummonersController.champions')
Route.post('/summoner/records', 'SummonersController.records')
Route.post('/summoner/live', 'SummonersController.liveMatchDetails')

Route.post('/match', 'MatchesController.index')
Route.post('/match/details', 'MatchesController.show')
Route.post('/match/details/ranks', 'MatchesController.showRanks')
