import { Container, Sprite, Texture, Text } from "pixi.js"
import Core, { Sounds } from "../.."
import AlmanacScreen from "../screen/AlmanacScreen"
import AbstractButton from "./AbstractButton"

export default class AlamanacIndexButton extends AbstractButton {
  private bg: Sprite
  
  public constructor(core: Core, x: number, y: number) {
    super(core, x, y, () => {
      core.setScreen(new AlmanacScreen(core))
    })

    this.bg = this.addChild(Sprite.from('AlmanacIndexBtn'))

    const t = this.bg.addChild(new Text('Almanac Index', {
      fill: 0x292959,
      fontSize: 16
    }))
    t.position.set(30, 3)
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from('AlmanacIndexBtnHighlight')
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from('AlmanacIndexBtn')
    this.bg.position.set(0, 0)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.texture = Texture.from('AlmanacIndexBtnHighlight')
    this.bg.position.set(1, 1)
  }

  protected override onMouseRelease(): void {
    this.bg.texture = Texture.from('AlmanacIndexBtn')
    this.bg.position.set(0, 0)
  }
}