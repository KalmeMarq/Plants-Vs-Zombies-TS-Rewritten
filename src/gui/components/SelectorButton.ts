import Core from '@/.'
import CustomHitArea from '@/data/CustomHitArea'
import AbstractButton from '@/gui/components/AbstractButton'
import { Sprite, Texture } from 'pixi.js'

export default class SelectorButton extends AbstractButton {
  private bgN: string
  private hlbgN: string
  private shadowN: string
  private bg: Sprite

  public constructor(core: Core, x: number, y: number, onPress: () => void, bg: string, hlbg: string, shadow: string, hitarea?: CustomHitArea) {
    super(core, x, y, onPress)

    this.bgN = bg
    this.hlbgN = hlbg
    this.shadowN = shadow

    this.addChild(Sprite.from(this.shadowN)).position.set(-3, 3)
    this.bg = this.addChild(Sprite.from(this.bgN))

    if (hitarea) this.hitArea = hitarea
  }

  public setEnabled(value: boolean): void {
    this.enabled = value

    if (!this.enabled) this.bg.tint = 0x777777
    else this.bg.tint = 0xffffff
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from(this.hlbgN)
  }

  protected override onMouseLeave(): void {
    this.bg.position.set(0, 0)
    this.bg.texture = Texture.from(this.bgN)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.position.set(1, 1)
    this.bg.texture = Texture.from(this.hlbgN)
  }

  protected override onMouseRelease(): void {
    this.bg.position.set(0, 0)
    this.bg.texture = Texture.from(this.bgN)
  }
}
