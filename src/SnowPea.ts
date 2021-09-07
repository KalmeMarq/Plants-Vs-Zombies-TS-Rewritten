import { Texture } from "@pixi/core"
import Plant from "./Plant"
import SnowPeaProjectile from "./SnowPeaProjectile"

export default class SnowPea extends Plant {
  public static cost: number = 175

  protected override init(): void {
    this.plantSprite.texture = Texture.from('SnowPea')
  }

  public override shoot(): void {
    const proj0G = new SnowPeaProjectile(this.level, this.position.x, this.position.y)
    this.level.projectiles.push(proj0G)
    this.level.core.root.addChild(proj0G)
  }
}