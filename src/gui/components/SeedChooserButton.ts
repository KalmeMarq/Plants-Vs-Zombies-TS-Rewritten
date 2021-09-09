import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import AbstractButton from '@/gui/components/AbstractButton'
import { Sprite } from '@pixi/sprite'
import { filters } from 'pixi.js'

const h = new filters.ColorMatrixFilter()
h.brightness(1.55, true)

const l = new filters.ColorMatrixFilter()
l.brightness(1.3, true)

export default class SeedChooserButton extends AbstractButton {
  private bg: Sprite
  private glow: Sprite
  private text: FontText

  public constructor(core: Core, x: number, y: number, title: string, onPress: () => void) {
    super(core, x, y, onPress)

    this.bg = this.addChild(Sprite.from('SeedChooserButton'))

    this.glow = this.bg.addChild(Sprite.from('SeedChooserButtonGlow'))
    this.glow.visible = false
    this.text = this.bg.addChild(new FontText(core.fontManager, Font.DwarvenTodcraft18Yellow, title))
    this.text.setAnchor(0.5, 0.5)
    this.text.setPos(this.bg.width / 2, this.bg.height / 2)
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.glow.visible = true
    this.glow.filters = [l]
    this.text.filters = [h]
  }

  protected override onMouseLeave(): void {
    this.bg.position.set(0, 0)
    this.glow.visible = false
    this.glow.filters = []
    this.text.filters = []
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.position.set(1, 1)
    this.glow.visible = true
  }

  protected override onMouseRelease(): void {
    this.bg.position.set(0, 0)
  }
}
