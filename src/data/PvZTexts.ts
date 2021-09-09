import Convert, { IPVZTexts } from '@/data/Converter'

export default class PvZTexts {
  public lawnStrings: IPVZTexts
  public zombatarTOS: IPVZTexts

  public constructor() {
    this.lawnStrings = {}
    this.zombatarTOS = {}
  }

  public async load(): Promise<void> {
    const lawnStrings = await (await fetch('static/properties/LawnStrings.txt')).text()
    const zombatarTOS = await (await fetch('static/properties/ZombatarTOS.txt')).text()

    this.lawnStrings = Convert.toPVZTexts(lawnStrings)
    this.zombatarTOS = Convert.toPVZTexts(zombatarTOS)
  }
}
