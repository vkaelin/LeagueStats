'use strict'

const { Command } = require('@adonisjs/ace')
const DetailedMatchTransformer = use('App/Transformers/DetailedMatchTransformer')
const Database = use('Database')
const Jax = use('App/Services/Jax')
const DetailedMatch = use('App/Models/DetailedMatch')
const Queue = use('Bee/Queue')

class EditDetailedMatch extends Command {
  static get signature() {
    return `
      edit:detailed:match
      { concurrent?=10 : Number of concurrent jobs }
    `
  }

  static get description() {
    return 'Edit DetailedMatches in the db with the new Transformer version'
  }

  /**
   * Create edit-detailed-matches Queue
   */
  createQueue(concurrent) {
    Queue.get('edit-detailed-matches').process(concurrent, async (job) => {
      // Get stats from Riot API
      const matchRiot = await Jax.Match.get(job.data.gameId, job.data.region)
      // Transform raw matches data
      const transformedMatch = await DetailedMatchTransformer.transform(matchRiot)

      // Update match in DB
      await DetailedMatch.where('_id', job.data._id).update(transformedMatch)

      return
    })

    /**
     * Job (edit detailed match) finished with success
     */
    Queue.get('edit-detailed-matches').on('succeeded', (job, result) => {
      console.log(`Job ${job.id} succeeded`)
    })
  }

  async handle(args, options) {
    console.time('EditDetailedMatches')

    this.createQueue(args.concurrent)

    // All detailed matches from the db
    const matches = await DetailedMatch.all()
    const matchesArray = matches.toJSON()

    // Create jobs
    const jobs = []
    for (const match of matchesArray) {
      const matchInfos = {
        _id: match._id,
        gameId: match.gameId,
        region: match.region,
      }
      const job = await Queue
        .get('edit-detailed-matches')
        .createJob(matchInfos)
        .save()
      jobs.push(job)
    }

    // Wait that all jobs are done
    const finalResult = await new Promise((resolve, reject) => {
      const lastJob = jobs[jobs.length - 1]
      lastJob.on('succeeded', result => {
        resolve(`FINAL RESULT for job ${lastJob.id}`)
      })
    })

    Database.close()
    console.timeEnd('EditDetailedMatches')
    this.success(`${this.icon('success')} Edit ${matchesArray.length} DetailedMatches completed`)
  }
}

module.exports = EditDetailedMatch
