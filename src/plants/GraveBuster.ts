import Plant from '@/plants/Plant'
import { Texture } from '@pixi/core'

export default class GraveBuster extends Plant {
  private startTime = 0
  public static cost = 75
  public id = 'grave_buster'

  protected override init(): void {
    Plant.plants.push({ p: this, c: Plant.cost })
    this.plantSprite.texture = Texture.from('GraveBuster')
    this.plantSprite.scale.set(0.8, 0.8)
  }

  public override update(dt: number): void {
    if (this.health <= 0) {
      this.parent.removeChild(this)
      const f = this.level.slots.find(s => s.r === this.r && this.c === s.c)
      if (f) f.plant = null
      this.destroy()
    }

    if (this.startTime === 0) {
      this.startTime = Date.now()
    }

    if (Date.now() - this.startTime > 4000) {
      const i = this.level.tombs.findIndex(t => this.r === t.r && this.c === t.c)

      if (i >= 0) {
        this.level.tombs[i].parent.removeChild(this.level.tombs[i])
        this.level.tombs.splice(i, 1)
        this.health = 0
      }
    }
  }
}
