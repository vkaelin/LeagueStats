'use strict'

const { Command } = require('@adonisjs/ace')
const BasicMatchTransformer = use('App/Transformers/BasicMatchTransformer')
const Database = use('Database')
const Jax = use('App/Services/Jax')
const Match = use('App/Models/Match')
const Queue = use('Bee/Queue')

class EditMatch extends Command {
  static get signature() {
    return `
      edit:match
      { concurrent?=10 : Number of concurrent jobs }
    `
  }

  static get description() {
    return 'Edit matches in the db with the new Transformer version'
  }

  /**
   * Create edit-matches Queue
   */
  createQueue(concurrent) {
    Queue.get('edit-matches').process(concurrent, async (job) => {
      // Get stats from Riot API
      const matchRiot = await Jax.Match.get(job.data.gameId, job.data.region)
      const account = {
        accountId: (matchRiot.participantIdentities.find(s => s.player.summonerName === job.data.name)).player.currentAccountId,
        puuid: job.data.summoner_puuid
      }

      // Transform raw matches data
      const transformedMatch = await BasicMatchTransformer.transform(matchRiot, { account })

      // Update match in DB
      await Match.where('_id', job.data._id).update(transformedMatch)

      return
    })

    /**
     * Job (edit match) finished with success
     */
    Queue.get('edit-matches').on('succeeded', (job, result) => {
      console.log(`Job ${job.id} succeeded`)
    })
  }

  async handle(args, options) {
    console.time('EditMatches')

    this.createQueue(args.concurrent)

    // All matches from the db
    const matches = await Match.all()
    const matchesArray = matches.toJSON()
    console.log(`${matchesArray.length} matches to edit.`)

    // Create jobs
    const jobs = []
    for (const match of matchesArray) {
      const matchInfos = {
        _id: match._id,
        gameId: match.gameId,
        name: match.name,
        region: match.region,
        summoner_puuid: match.summoner_puuid
      }
      const job = await Queue
        .get('edit-matches')
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
    console.timeEnd('EditMatches')
    this.success(`${this.icon('success')} Edit ${matchesArray.length} Matches completed`)
  }
}

module.exports = EditMatch
