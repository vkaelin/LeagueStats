import { MongodbConfig } from '@ioc:Mongodb/Database'
import Env from '@ioc:Adonis/Core/Env'

const config: MongodbConfig = {
  default: 'mongodb',
  connections: {
    mongodb: {
      url: Env.get('MONGODB_URL') as string,
      database: Env.get('MONGODB_DATABASE') as string,
    },
  },
}

export default config
