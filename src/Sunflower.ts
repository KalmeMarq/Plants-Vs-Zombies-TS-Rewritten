import { Texture } from "@pixi/core";
import Plant from "./Plant";
import Sun from "./Sun";

export default class Sunflower extends Plant {
  public static override cost: number = 50
  public timer: number = 0

  protected override init(): void {
    this.plantSprite.texture = Texture.from('Sunflower')
  }

  public override update(dt: number): void {
    if(this.health <= 0) {
      this.parent.removeChild(this)
      this.level.slots.find(s => s.r === this.r && this.c === s.c)!.plant = null
      this.destroy()
    }

    this.timer++

    if(this.timer > 1000) {
      this.timer = 0
      let sun0G = new Sun(this.level, this.x + 20, this.y)
      this.level.suns.push(sun0G)
      this.level.core.root.addChild(sun0G)
    }
  }
}