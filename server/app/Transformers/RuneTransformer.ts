import { PerkDTO, PerkStyleDTO } from 'App/Services/Jax/src/Endpoints/CDragonEndpoint'

class RuneTransformer {
  public transformPerks (perks: PerkDTO[]) {
    return perks.map((perk) => ({
      id: perk.id,
      name: perk.name,
      desc: perk.longDesc,
      icon: perk.iconPath,
    }))
  }

  public transformStyles (styles: PerkStyleDTO[]) {
    return styles.map(style => ({
      id: style.id,
      name: style.name,
      icon: style.iconPath,
    }))
  }
}

export default new RuneTransformer()
