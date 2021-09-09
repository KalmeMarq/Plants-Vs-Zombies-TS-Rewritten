import Core from '@/.'
import AbstractButton from '@/gui/components/AbstractButton'
import { Sprite, Texture } from 'pixi.js'

export default class MainPotButton extends AbstractButton {
  private bg: Sprite
  private bg1N: string
  private bg2N: string

  public constructor(core: Core, x: number, y: number, bg1N: string, bg2N: string, onPress: () => void) {
    super(core, x, y, onPress)

    this.bg1N = bg1N
    this.bg2N = bg2N
    this.bg = this.addChild(Sprite.from(this.bg1N))
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from(this.bg2N)
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from(this.bg1N)
    this.bg.position.set(0, 0)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.texture = Texture.from(this.bg2N)
    this.bg.position.set(1, 1)
  }

  protected override onMouseRelease(): void {
    this.bg.texture = Texture.from(this.bg1N)
    this.bg.position.set(0, 0)
  }
}
