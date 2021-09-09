import Core from '@/.'
import Font from '@/font/Font'
import FontText from '@/font/FontText'
import AbstractButton from '@/gui/components/AbstractButton'
import AlmanacScreen from '@/gui/screen/AlmanacScreen'
import MainMenuScreen from '@/gui/screen/MainMenuScreen'
import { Sprite, Texture } from 'pixi.js'

export default class AlamanacIndexButton extends AbstractButton {
  private bg: Sprite

  public constructor(core: Core, x: number, y: number) {
    super(core, x, y, () => {
      core.setScreen(new AlmanacScreen(core, () => {
        core.setScreen(new MainMenuScreen(core))
      }))
    })

    this.bg = this.addChild(Sprite.from('AlmanacIndexBtn'))

    const t = this.bg.addChild(new FontText(core.fontManager, Font.BrianneTod16, 'ALMANAC INDEX', 0x292959))
    t.setPos(30, 4)
    t.scale.set(0.8, 0.8)
  }

  protected override onMouseOver(): void {
    super.onMouseOver()
    this.bg.texture = Texture.from('AlmanacIndexBtnHighlight')
  }

  protected override onMouseLeave(): void {
    this.bg.texture = Texture.from('AlmanacIndexBtn')
    this.bg.position.set(0, 0)
  }

  protected override onMouseDown(): void {
    super.onMouseDown()
    this.bg.texture = Texture.from('AlmanacIndexBtnHighlight')
    this.bg.position.set(1, 1)
  }

  protected override onMouseRelease(): void {
    this.bg.texture = Texture.from('AlmanacIndexBtn')
    this.bg.position.set(0, 0)
  }
}
