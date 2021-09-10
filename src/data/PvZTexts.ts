import { IPVZTexts } from '@/data/Converter'
import { parse as parseYAML } from 'yaml'

export default class PvZTexts {
  public lawnStrings: IPVZTexts
  public zombatarTOS: IPVZTexts

  public constructor() {
    this.lawnStrings = {}
    this.zombatarTOS = {}
  }

  public async load(): Promise<void> {
    const lawnStrings = parseYAML(await (await fetch('static/data/LawnStrings.yaml')).text())
    const zombatarTOS = parseYAML(await (await fetch('static/data/ZombatarTOS.yaml')).text())

    this.lawnStrings = lawnStrings
    this.zombatarTOS = zombatarTOS
  }
}
