import Plant from '@/plants/Plant'
import { Texture } from '@pixi/core'

export default class Wallnut extends Plant {
  private maxHealth = 2000
  public static cost = 50
  public id = 'wall_nut'

  protected override init(): void {
    Plant.plants.push({ p: this, c: Plant.cost })
    this.plantSprite.texture = Texture.from('WallnutBody')
    this.plantSprite.scale.set(0.7, 0.7)

    this.health = 3000
  }

  public override update(): void {
    if (this.health <= 0) {
      this.parent.removeChild(this)
      const f = this.level.slots.find(s => s.r === this.r && this.c === s.c)
      if (f) f.plant = null
      this.destroy()
    }

    if (this.health <= this.maxHealth * 1 / 3) {
      this.plantSprite.texture = Texture.from('WallnutCracked2')
    } else if (this.health <= this.maxHealth * 2 / 3) {
      this.plantSprite.texture = Texture.from('WallnutCracked1')
    }
  }
}
