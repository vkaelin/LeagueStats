'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')
const Queue = use('Bee/Queue')
const Summoner = use('App/Models/Summoner')
const { getSeasonNumber } = use('App/helpers')

class EditMatchList extends Command {
  static get signature() {
    return 'edit:match:list'
  }

  static get description() {
    return 'Edit all matchlist of players to add season of the matches'
  }

  /**
  * Create edit-matchList Queue
   */
  createQueue(concurrent) {
    Queue.get('edit-matchList').process(concurrent, async (job) => {
      // Update matchlist with season
      job.data.matchList = job.data.matchList.map(m => {
        m.seasonMatch = getSeasonNumber(m.timestamp)
        return m
      })

      // Update Summoner in DB
      await Summoner.where('puuid', job.data.puuid).update(job.data)

      return
    })

    /**
     * Job (edit matchList) finished with success
     */
    Queue.get('edit-matchList').on('succeeded', (job, result) => {
      console.log(`Job ${job.id} succeeded`)
    })
  }

  async handle(args, options) {
    console.time('EditMatchList')
    this.info('Start EditMatchList Command')

    this.createQueue(10)

    // All sumoners from the db
    const summoners = await Summoner.all()
    const summonersArray = summoners.toJSON()

    // Create jobs
    const jobs = []
    for (const summoner of summonersArray) {
      const job = await Queue
        .get('edit-matchList')
        .createJob(summoner)
        .save()
      jobs.push(job)
    }

    // Wait that all jobs are done
    await new Promise((resolve, reject) => {
      const lastJob = jobs[jobs.length - 1]
      lastJob.on('succeeded', result => {
        resolve(`FINAL RESULT for job ${lastJob.id}`)
      })
    })

    Database.close()
    console.timeEnd('EditMatchList')
    this.success(`${this.icon('success')} Edit ${summonersArray.length} Summoners completed`)
  }
}

module.exports = EditMatchList
