import Env from '@ioc:Adonis/Core/Env'
import { BullConfig } from '@ioc:Rocketseat/Bull'

/*
|--------------------------------------------------------------------------
| Bull configuration
|--------------------------------------------------------------------------
|
| Following is the configuration used by the Bull provider to connect to
| the redis server.
|
| Do make sure to pre-define the connections type inside `contracts/bull.ts`
| file for Rocketseat/Bull to recognize connections.
|
| Make sure to check `contracts/bull.ts` file for defining extra connections
*/

const bullConfig: BullConfig = {
  connection: Env.get('BULL_CONNECTION', 'local'),

  connections: {
    local: {
      host: Env.get('BULL_REDIS_HOST', 'localhost'),
      port: Env.get('BULL_REDIS_PORT'),
      password: Env.get('BULL_REDIS_PASSWORD'),
    },
  },
}

export default bullConfig
