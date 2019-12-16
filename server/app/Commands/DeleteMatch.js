'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')
const Match = use('App/Models/Match')

class DeleteMatch extends Command {
  static get signature() {
    return `
      delete:match
      { field : Field to check }
      { value?=null : Value of the field, if true: delete match }
    `
  }

  static get description() {
    return 'Delete matches from db with a condition'
  }

  async handle(args, options) {
    console.time('DeleteMatches')
    const nbMatchesBefore = await Match.count()
    const matches = await Match.all()
    for (const match of matches.toJSON()) {
      await Match.where('_id', match._id).where(args.field, args.value).delete()
    }
    const nbMatchesAfter = await Match.count()
    Database.close()
    console.timeEnd('DeleteMatches')
    this.success(`${this.icon('success')} Delete Matches completed: ${nbMatchesBefore - nbMatchesAfter} matche(s) deleted`)
  }
}

module.exports = DeleteMatch
