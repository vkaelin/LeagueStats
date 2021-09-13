import { PerkDTO, PerkStyleDTO } from 'App/Services/Jax/src/Endpoints/CDragonEndpoint'

class RuneSerializer {
  public serializePerks(perks: PerkDTO[]) {
    return perks.reduce((acc, perk) => {
      acc[perk.id] = {
        name: perk.name,
        desc: perk.longDesc,
        icon: perk.iconPath,
      }
      return acc
    }, {})
  }

  public serializeStyles(styles: PerkStyleDTO[]) {
    return styles.reduce((acc, style) => {
      acc[style.id] = {
        name: style.name,
        icon: style.iconPath,
        slots: style.slots.filter((s) => s.type !== 'kStatMod').map((s) => s.perks),
      }
      return acc
    }, {})
  }
}

export default new RuneSerializer()
