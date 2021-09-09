import Core from '@/.'
import Convert, { INewPVZFont } from '@/data/Converter'
import Font from '@/font/Font'
import Logger from '@/Logger'
import { BaseTexture, Container, Rectangle, SCALE_MODES, Sprite, Texture } from 'pixi.js'

export default class FontManager {
  private core: Core
  public fonts: Map<Font, BaseTexture>
  public fontsInfo: Map<Font, INewPVZFont>

  public constructor(core: Core) {
    this.core = core
    this.fonts = new Map()
    this.fontsInfo = new Map()
  }

  public async load(): Promise<void> {
    const fonts = [
      '_BrianneTod16',
      '_BrianneTod12',
      '_BrianneTod32',
      '_Pico129',
      '_DwarvenTodcraft18Yellow',
      '_HouseofTerror28',
      '_ContinuumBold14',
      '_DwarvenTodcraft36GreenInset',
      '_DwarvenTodcraft36BrightGreenInset',
      '_DwarvenTodcraft18GreenInset',
      '_DwarvenTodcraft18BrightGreenInset',
      '_DwarvenTodcraft18',
      '_DwarvenTodcraft15',
      '_DwarvenTodcraft12'
    ]

    for (let i = 0; i < fonts.length; i++) {
      const jk = fonts[i] as Font
      const d = await (await fetch('./static/data/' + jk.replace('_', '') + '.txt')).text()

      this.fontsInfo.set(jk, Convert.newFontInfo(d))
      // Logger.info(jk, this.fontsInfo.get(jk));
      if (jk !== '_DwarvenTodcraft18' && jk !== '_DwarvenTodcraft15' && jk !== '_DwarvenTodcraft12' && jk !== '_DwarvenTodcraft18Yellow' && jk !== '_HouseofTerror28' && jk !== '_DwarvenTodcraft36BrightGreenInset' && jk !== '_DwarvenTodcraft36GreenInset' && jk !== '_DwarvenTodcraft18BrightGreenInset' && jk !== '_DwarvenTodcraft18GreenInset') {
        const si = Sprite.from(jk)

        const c = document.createElement('canvas')
        c.width = si.width
        c.height = si.height
        const ctx = c.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, si.width, si.height)
        }

        const font = new Sprite(new Texture(new BaseTexture(c)))
        font.addChild(si)
        font.mask = si
        font.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

        const s = this.core.app.renderer.generateTexture(font).baseTexture
        this.fonts.set(jk as Font, s)
      } else {
        const font = Sprite.from(jk)
        const s = this.core.app.renderer.generateTexture(font).baseTexture
        this.fonts.set(jk as Font, s)
      }
    }
  }

  /** @deprecated */
  public createText(font: Font, str: string, tint = 0xffffff): Container {
    const m = str.split('')

    const text = new Container()
    const txr = this.fonts.get(font)
    const fontInfo = this.fontsInfo.get(font)

    if (!txr || !fontInfo) return text

    for (let i = 0, j = 0; i < m.length; i++) {
      if (m[i] === ' ') {
        j += 4
        continue
      }

      const info = fontInfo[m[i]]
      Logger.info(m[i], info)
      const l = new Sprite(new Texture(txr, new Rectangle(info.rect[0], info.rect[1], info.rect[2], info.rect[3])))
      l.tint = tint
      l.position.x = j
      text.addChild(l)
      j += info.w
    }

    return text
  }
}
