import { Texture } from "@pixi/core"
import Plant from "./Plant"

export default class SnowPea extends Plant {
  protected override init(): void {
    this.plantSprite.texture = Texture.from('SnowPea')
  }
}