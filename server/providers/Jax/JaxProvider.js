const { ServiceProvider } = require('@adonisjs/fold')
const Jax = require('./src/Jax')
const Config = require('./JaxConfig')

class JaxProvider extends ServiceProvider {
  register () {
    this.app.singleton('Jax', () => {
      return new Jax(Config)
    })
  }

  boot() {
    use('Jax')
  }
}

module.exports = JaxProvider