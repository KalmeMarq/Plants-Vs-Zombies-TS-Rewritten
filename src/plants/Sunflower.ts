import Sun from '@/level/Sun'
import Plant from '@/plants/Plant'
import { Texture } from '@pixi/core'

export default class Sunflower extends Plant {
  public static override cost = 50
  public id = 'sunflower'
  public timer = 0

  protected override init(): void {
    Plant.plants.push({ p: this, c: Plant.cost })
    this.plantSprite.texture = Texture.from('Sunflower')
  }

  public override update(): void {
    if (this.health <= 0) {
      this.parent.removeChild(this)
      const f = this.level.slots.find(s => s.r === this.r && this.c === s.c)
      if (f) f.plant = null
      this.destroy()
    }

    this.timer++

    if (this.timer > 1000) {
      this.timer = 0
      const sun0G = new Sun(this.level, this.x + 20, this.y)
      this.level.suns.push(sun0G)
      this.level.addChild(sun0G)
    }
  }
}
