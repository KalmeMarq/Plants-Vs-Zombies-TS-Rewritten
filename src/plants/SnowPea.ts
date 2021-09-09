import SnowPeaProjectile from '@/level/SnowPeaProjectile'
import Plant from '@/plants/Plant'
import { Texture } from '@pixi/core'

export default class SnowPea extends Plant {
  public static cost = 175
  public id = 'snow_pea'

  protected override init(): void {
    Plant.plants.push({ p: this, c: Plant.cost })
    this.plantSprite.texture = Texture.from('SnowPea')
  }

  public override shoot(): void {
    const proj0G = new SnowPeaProjectile(this.level, this.position.x, this.position.y)
    this.level.projectiles.push(proj0G)
    this.level.addChild(proj0G)
  }
}
