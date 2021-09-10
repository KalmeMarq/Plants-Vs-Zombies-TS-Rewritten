import Core from '@/.'
import Font from '@/font/Font'
import { BaseTexture, SCALE_MODES, Sprite, Texture } from 'pixi.js'
import { parse as parseYAML } from 'yaml'

export default class FontManager {
  private core: Core
  public fonts: Map<Font, BaseTexture>
  public fontsInfo: Map<Font, { [key: string]: { width: number, offset: [number, number], rect: [number, number, number, number] } }>

  public constructor(core: Core) {
    this.core = core
    this.fonts = new Map()
    this.fontsInfo = new Map()
  }

  public async load(): Promise<void> {
    const fonts = [
      'BrianneTod12',
      'BrianneTod32',
      'Pico129',
      'DwarvenTodcraft18Yellow',
      'HouseofTerror28',
      'ContinuumBold14',
      'DwarvenTodcraft36GreenInset',
      'DwarvenTodcraft36BrightGreenInset',
      'DwarvenTodcraft18GreenInset',
      'DwarvenTodcraft18BrightGreenInset',
      'DwarvenTodcraft18',
      'DwarvenTodcraft15',
      'DwarvenTodcraft12'
    ]

    for (let i = 0; i < fonts.length; i++) {
      await this.loadFont(fonts[i])
    }
  }

  public async preload(): Promise<void> {
    await this.loadFont('BrianneTod16')
  }

  private async loadFont(name: string): Promise<void> {
    const fontname = '_' + name as Font
    const data = await (await fetch('./static/data/fonts/' + name + '.yaml')).text()
    const parsed = parseYAML(data)
    this.fontsInfo.set(fontname, parsed.chars)

    if (parsed.properties.mask) {
      const fontSprite = Sprite.from(name)

      const c = document.createElement('canvas')
      c.width = fontSprite.width
      c.height = fontSprite.height
      const ctx = c.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, fontSprite.width, fontSprite.height)
      }

      const fontBaseTexture = new Sprite(new Texture(new BaseTexture(c)))
      fontBaseTexture.addChild(fontSprite)
      fontBaseTexture.mask = fontSprite
      fontBaseTexture.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

      const font = this.core.app.renderer.generateTexture(fontBaseTexture).baseTexture
      this.fonts.set(fontname, font)
    } else {
      const fontSprite = Sprite.from(name)
      const fontBaseTexture = this.core.app.renderer.generateTexture(fontSprite).baseTexture
      this.fonts.set(fontname, fontBaseTexture)
    }
  }
}
