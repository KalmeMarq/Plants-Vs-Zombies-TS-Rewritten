import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import { filters } from "pixi.js";
import Core, { Font, FontText } from "../..";
import AbstractButton from "./AbstractButton";

export default class SeedChooserButton extends AbstractButton {
  private bg: Sprite
  private glow: Sprite
  private text: FontText

  public constructor(core: Core, x: number, y: number, title: string, onPress: () => void) {
    super(core, x, y, onPress)

    this.bg = this.addChild(Sprite.from('SeedChooserButton'))

    // const t = this.bg.addChild(new Text(title, {
    //   fill: 0xffffff,
    //   fontSize: 20
    // }))

    // t.position.set(this.bg.width / 2, this.bg.height / 2)
    // t.anchor.set(0.5, 0.5)

    this.text = this.bg.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft18Yellow, title))
    this.text.setAnchor(0.5, 0.5)
    this.text.setPos(this.bg.width / 2, this.bg.height / 2)
    this.glow = this.bg.addChild(Sprite.from('SeedChooserButtonGlow'))
    this.glow.visible = false

  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    // this.bg.texture = Texture.from('AlmanacCloseBtnHighlight')
    this.glow.visible = true
    const y = new filters.ColorMatrixFilter()
    y.matrix = [
      1, 0, 0, 0, 0.3,
      0, 1, 0, 0, 0.3,
      0, 0, 1, 0, 0.3,
      0, 0, 0, 1, 0 
    ] as any
    this.text.filters= [y]
  }

  protected override onMouseLeave(): void {
    // this.bg.texture = Texture.from('AlmanacCloseBtn')
    this.bg.position.set(0, 0)
    this.glow.visible = false

    this.text.filters= []
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    // this.bg.texture = Texture.from('AlmanacCloseBtnHighlight')
    this.bg.position.set(1, 1)
    this.glow.visible = true
    const y = new filters.ColorMatrixFilter()
    y.matrix = [
      1, 0, 0, 0, 0.3,
      0, 1, 0, 0, 0.3,
      0, 0, 1, 0, 0.3,
      0, 0, 0, 1, 0 
    ] as any
    this.text.filters= [y]
  }

  protected override onMouseRelease(): void {
    // this.bg.texture = Texture.from('AlmanacCloseBtn')
    this.bg.position.set(0, 0)
  }
}