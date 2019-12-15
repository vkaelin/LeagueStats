'use strict'

const BeeQueue = require('bee-queue')

class Queue {
  constructor(Config) {
    this.Config = Config
    this._queuesPool = {}
  }

  get(name) {
    /**
     * If there is an instance of queue already, then return it
     */
    if (this._queuesPool[name]) {
      return this._queuesPool[name]
    }

    /**
     * Read configuration using Config
     * provider
     */
    const config = this.Config.get(`queue.${name}`)

    /**
     * Create a new queue instance and save it's
     * reference
     */
    this._queuesPool[name] = new BeeQueue(name, config)

    /**
     * Return the instance back
     */
    return this._queuesPool[name]
  }
}

module.exports = Queue
