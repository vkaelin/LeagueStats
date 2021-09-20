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

Route.get('/', async () => ({
  hi: 'Hello World from LeagueStats V2 API',
  uptime: process.uptime(),
}))

Route.get('/health', async () => ({ report: await HealthCheck.getReport() }))

Route.post('/summoner/basic', 'SummonersController.basic')
Route.post('/summoner/overview', 'SummonersController.overview')

Route.post('/summoner/champions', 'SummonersController.champions')
Route.post('/summoner/records', 'SummonersController.records')
Route.post('/summoner/live', 'SummonersController.liveMatchDetails')

Route.post('/match', 'MatchesController.index')
Route.post('/match/details', 'MatchesController.show')
Route.post('/match/details/ranks', 'MatchesController.showRanks')

Route.get('/cdragon/runes', 'CDragonController.runes')
