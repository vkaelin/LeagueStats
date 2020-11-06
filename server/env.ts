import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  APP_KEY: Env.schema.string(),

  MONGODB_URL: Env.schema.string(),
  MONGODB_DATABASE: Env.schema.string(),

  REDIS_CONNECTION: Env.schema.enum(['local'] as const),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),

  API_KEY: Env.schema.string(),
})
