import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import LawnText from '@/font/LawnText'
import AbstractButton from '@/gui/components/AbstractButton'
import { Sprite, Texture } from 'pixi.js'

export default class DialogQuitButton extends AbstractButton {
  private bg: Sprite
  public msg: FontText

  public constructor(core: Core, x: number, y: number, title: string | LawnText, onPress: () => void) {
    super(core, x, y, onPress)

    this.bg = this.addChild(Sprite.from('options_backtogamebutton0'))

    this.msg = this.bg.addChild(new FontText(this.core.fontManager, Font.DwarvenTodcraft36GreenInset, title))
    this.msg.setAnchor(1, 1)
    this.msg.setPos(this.width / 2, this.height / 2 - 3)
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.msg.setFont(Font.DwarvenTodcraft36BrightGreenInset)
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from('options_backtogamebutton0')
    this.bg.position.set(0, 0)
    this.msg.setFont(Font.DwarvenTodcraft36GreenInset)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.texture = Texture.from('options_backtogamebutton2')
    this.bg.position.set(0, 1)
  }

  protected override onMouseRelease(): void {
    this.bg.texture = Texture.from('options_backtogamebutton0')
    this.bg.position.set(0, 0)
  }
}
