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
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'
import MatchParser from 'App/Parsers/MatchParser'
import Jax from 'App/Services/Jax'

Route.get('/', async () => ({
  hi: 'Hello World from LeagueStats V2 API',
  uptime: process.uptime(),
}))

Route.get('/health', async () => ({ report: await HealthCheck.getReport() }))

Route.post('/summoner/basic', 'SummonersController.basic')
Route.post('/summoner/overview', 'SummonersController.overview')

// Route.post('/summoner/champions', 'SummonersController.champions')
// Route.post('/summoner/records', 'SummonersController.records')
// Route.post('/summoner/live', 'SummonersController.liveMatchDetails')

// Route.post('/match', 'MatchesController.index')
// Route.post('/match/details', 'MatchesController.show')
// Route.post('/match/details/ranks', 'MatchesController.showRanks')

Route.get('/cdragon/runes', 'CDragonController.runes')

Route.get('/test', async () => {
  const ids = [
    'EUW1_5221171940',
    'EUW1_5220845489',
    'EUW1_5220852134',
    'EUW1_5220728352',
    'EUW1_5220656980',
    'EUW1_5215357679',
    'EUW1_5215311330',
    'EUW1_5215244329',
    'EUW1_5214301786',
    'EUW1_5212337578',
    'EUW1_5212353922',
    'EUW1_5212371343',
  ]
  const region = 'euw1'
  const matches = await Promise.all(ids.map((id) => Jax.Match.get(id, region)))
  await MatchParser.parse(matches)
})
