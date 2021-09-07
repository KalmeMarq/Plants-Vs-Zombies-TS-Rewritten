import { Container, Sprite, Texture, Text } from "pixi.js"
import Core, { Sounds } from "../.."
import MainMenuScreen from "../screen/MainMenuScreen"
import AbstractButton from "./AbstractButton"

export default class AlamanacCloseButton extends AbstractButton {
  private bg: Sprite
  
  public constructor(core: Core, x: number, y: number) {
    super(core, x, y, () => {
      core.setScreen(new MainMenuScreen(core))
    })

    this.bg = this.addChild(Sprite.from('AlmanacCloseBtn'))

    const t = this.bg.addChild(new Text('Close', {
      fill: 0x292959,
      fontSize: 16
    }))
    t.position.set(10, 3)
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from('AlmanacCloseBtnHighlight')
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from('AlmanacCloseBtn')
    this.bg.position.set(0, 0)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.texture = Texture.from('AlmanacCloseBtnHighlight')
    this.bg.position.set(1, 1)
  }

  protected override onMouseRelease(): void {
    this.bg.texture = Texture.from('AlmanacCloseBtn')
    this.bg.position.set(0, 0)
  }
}