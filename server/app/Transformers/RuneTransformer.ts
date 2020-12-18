import { PerkDTO, PerkStyleDTO } from 'App/Services/Jax/src/Endpoints/CDragonEndpoint'

class RuneTransformer {
  public transformPerks (perks: PerkDTO[]) {
    return perks.reduce((acc, perk) => {
      acc[perk.id] = {
        name: perk.name,
        desc: perk.longDesc,
        icon: perk.iconPath,
      }
      return acc
    }, {})
  }

  public transformStyles (styles: PerkStyleDTO[]) {
    return styles.reduce((acc, style) => {
      acc[style.id] = {
        name: style.name,
        icon: style.iconPath,
        slots: style.slots
          .filter(s => s.type !== 'kStatMod')
          .map(s => s.perks),
      }
      return acc
    }, {})
  }
}

export default new RuneTransformer()
