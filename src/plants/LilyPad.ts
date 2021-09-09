import Plant from '@/plants/Plant'
import { Texture } from '@pixi/core'

export default class LilyPad extends Plant {
  public static cost = 25
  public id = 'lily_pad'

  protected override init(): void {
    Plant.plants.push({ p: this, c: Plant.cost })
    this.plantSprite.texture = Texture.from('LilyPad_body')
    this.plantSprite.scale.set(0.7, 0.7)
  }

  public override update(): void {
    if (this.health <= 0) {
      this.parent.removeChild(this)
      const f = this.level.slots.find(s => s.r === this.r && this.c === s.c)
      if (f) f.plant = null
      this.destroy()
    }
  }
}
