import Font from '@/font/Font'
import FontText from '@/font/FontText'
import Level from '@/level/Level'
import { Container, Sprite } from 'pixi.js'

export default class SunBank extends Container {
  private level: Level
  public text: FontText

  public constructor(level: Level, x: number, y: number) {
    super()

    this.level = level
    this.x = x
    this.y = y

    const bg = Sprite.from('SunBank')
    bg.position.set(0, 0)
    bg.alpha = 0.0001
    this.addChild(bg)

    this.text = new FontText(level.core.fontManager, Font.ContinuumBold14, '0', 0x000000)
    this.text.setAnchor(0.5, 0)
    this.text.setPos(this.width / 2, 60)

    this.addChild(this.text)
  }
}
