import Core from '@/.'
import Font from '@/font/Font'
import FontManager from '@/font/FontManager'
import LawnText from '@/font/LawnText'
import { Texture } from '@pixi/core'
import { Container } from '@pixi/display'
import { Rectangle } from '@pixi/math'
import { Sprite } from 'pixi.js'

export default class FontText extends Container {
  private core: Core
  private fontManager: FontManager
  private t: Container
  private tsr = ''
  private color: number
  private font: Font
  private anchor: [number, number]
  private abPos: [number, number] = [0, 0]

  public constructor (fontM: FontManager, font: Font, text: string | LawnText, tint = 0xffffff) {
    super()
    this.core = Core.getInstance()
    this.fontManager = fontM
    this.font = font
    this.color = tint
    this.anchor = [0, 0]
    this.t = new Container()
    this.setText(text)
    this.addChild(this.t)
  }

  public setText (text: string | LawnText, tint?: number): void {
    this.t.removeChildren()
    this.tsr = typeof text === 'string' ? text : text.getFinal(this.core)

    if (tint) this.color = tint

    const m = this.tsr.split('')
    const txr = this.fontManager.fonts.get(this.font)

    if (!txr) return

    const fontInfo = this.fontManager.fontsInfo.get(this.font)

    if (!fontInfo) return

    for (let i = 0, j = 0; i < m.length; i++) {
      const info = fontInfo[m[i]]

      if (m[i] === ' ') {
        j += info.width
        continue
      }

      const l = new Sprite(new Texture(txr, new Rectangle(info.rect[0], info.rect[1], info.rect[2], info.rect[3])))
      l.tint = this.color
      l.position.x = j
      this.t.addChild(l)
      j += info.width
    }

    this.setPos(this.abPos[0], this.abPos[1])
  }

  public setColor (tint: number): void {
    this.setText(this.tsr, tint)
  }

  public setAnchor (x: number, y: number): void {
    this.anchor = [x, y]
    this.setPos(this.abPos[0], this.abPos[1])
  }

  public setFont (font: Font): void {
    this.font = font
    this.setText(this.tsr)
  }

  public setPos (x: number, y: number): void {
    this.abPos[0] = x
    this.abPos[1] = y
    this.x = this.abPos[0] - (this.anchor[0] * this.width)
    this.y = this.abPos[1] - (this.anchor[1] * this.height)
  }
}
