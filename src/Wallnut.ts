import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import Plant from "./Plant";

export default class Wallnut extends Plant {
  private maxHealth: number = 2000
  public static cost: number = 50

  protected override init(): void {
    this.plantSprite.texture = Texture.from('WallnutBody')
    this.plantSprite.scale.set(0.7, 0.7)

    this.health = 3000
  }

  public override update(dt: number): void {
    if(this.health <= 0) {
      this.parent.removeChild(this)
      this.level.slots.find(s => s.r === this.r && this.c === s.c)!.plant = null
      this.destroy()
    }

    if(this.health <= this.maxHealth * 1/3) {
      this.plantSprite.texture = Texture.from('WallnutCracked2')
    } else if(this.health <= this.maxHealth * 2/3) {
      this.plantSprite.texture = Texture.from('WallnutCracked1')
    }
  }
}