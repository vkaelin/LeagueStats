/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Bull from '@ioc:Rocketseat/Bull'
import Env from '@ioc:Adonis/Core/Env'

const PORT = 9999
const isDevelopment = Env.get('NODE_ENV') === 'development'

Bull.process()

if (isDevelopment) {
  Bull.ui(PORT)
}
