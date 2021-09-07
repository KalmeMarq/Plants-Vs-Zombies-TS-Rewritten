import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import Core from "../..";
import AbstractButton from "./AbstractButton";

export default class SeedChooserButton extends AbstractButton {
  private bg: Sprite

  public constructor(core: Core, x: number, y: number, title: string, onPress: () => void) {
    super(core, x, y, onPress)

    this.bg = this.addChild(Sprite.from('SeedChooserButton'))

    const t = this.bg.addChild(new Text(title, {
      fill: 0xffffff,
      fontSize: 20
    }))

    t.position.set(this.bg.width / 2, this.bg.height / 2)
    t.anchor.set(0.5, 0.5)
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    // this.bg.texture = Texture.from('AlmanacCloseBtnHighlight')
  }

  protected override onMouseLeave(): void {
    // this.bg.texture = Texture.from('AlmanacCloseBtn')
    this.bg.position.set(0, 0)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    // this.bg.texture = Texture.from('AlmanacCloseBtnHighlight')
    this.bg.position.set(1, 1)
  }

  protected override onMouseRelease(): void {
    // this.bg.texture = Texture.from('AlmanacCloseBtn')
    this.bg.position.set(0, 0)
  }
}