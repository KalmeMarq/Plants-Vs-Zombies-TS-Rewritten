import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import AbstractButton from '@/gui/components/AbstractButton'
import MainMenuScreen from '@/gui/screen/MainMenuScreen'
import { Sprite, Texture } from 'pixi.js'

export default class AlamanacCloseButton extends AbstractButton {
  private bg: Sprite

  public constructor(core: Core, x: number, y: number, onPress?: () => void) {
    super(core, x, y, onPress ?? function() {
      core.setScreen(new MainMenuScreen(core))
    })

    this.bg = this.addChild(Sprite.from('AlmanacCloseBtn'))

    const t = this.bg.addChild(new FontText(core.fontManager, Font.BrianneTod16, 'CLOSE', 0x292959))
    t.setPos(14, 4)
    t.scale.set(0.8, 0.8)
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
