import Core from '@/.'
import AbstractButton from '@/gui/components/AbstractButton'
import { Sprite } from '@pixi/sprite'
import { Texture } from 'pixi.js'

export default class SelectorSignButton extends AbstractButton {
  private bgN: string
  private psdbgN: string
  private bg: Sprite

  public constructor(core: Core, x: number, y: number, bgN: string, psdbgN: string, onPress: () => void) {
    super(core, x, y, onPress)

    this.bgN = bgN
    this.psdbgN = psdbgN

    this.bg = this.addChild(Sprite.from(this.bgN))
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from(this.psdbgN)
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from(this.bgN)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.texture = Texture.from(this.psdbgN)
  }

  protected override onMouseRelease(): void {
    this.bg.texture = Texture.from(this.bgN)
  }
}
