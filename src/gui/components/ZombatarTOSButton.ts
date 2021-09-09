import Core from '@/.'
import AbstractButton from '@/gui/components/AbstractButton'
import { Texture } from '@pixi/core'
import { Sprite } from '@pixi/sprite'

export default class ZombatarTOSButton extends AbstractButton {
  private bgN: string
  private bgHN: string
  private bg: Sprite

  public constructor(core: Core, x: number, y: number, bgN: string, bgHN: string, onPress: () => void) {
    super(core, x, y, onPress)

    this.bgN = bgN
    this.bgHN = bgHN
    this.bg = this.addChild(Sprite.from(this.bgN))
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from(this.bgHN)
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from(this.bgN)
    this.bg.position.set(0, 0)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.position.set(1, 1)
  }

  protected override onMouseRelease(): void {
    this.bg.position.set(0, 0)
  }
}
